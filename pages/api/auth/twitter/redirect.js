import { prisma } from "@context/PrismaContext";
import axios from "axios";
import url from "url";
import { getSession } from "next-auth/react";
import { utils } from "ethers";
import Enums from "enums";
import { isWhitelistUser } from "repositories/session-auth";

const TOKEN_TWITTER_AUTH_URL = "https://api.twitter.com/2/oauth2/token";
const USERINFO_TWITTER_URL = "https://api.twitter.com/2/users/me";

const { NEXT_PUBLIC_WEBSITE_HOST, NEXT_PUBLIC_TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET } =
    process.env;

// @dev this is used for twitter auth quest only
export default async function twitterRedirect(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                const session = await getSession({ req });
                let lookupUser = await isWhitelistUser(session);

                if (!session || !utils.isAddress(lookupUser.wallet)) {
                    throw new Error("Unauthenticated user");
                }

                const { code } = req.query;
                if (!code) {
                    res.status(422).json({ message: "Missing auth code for oath2" });
                }

                const formData = new url.URLSearchParams({
                    client_id: NEXT_PUBLIC_TWITTER_CLIENT_ID,
                    client_secret: TWITTER_CLIENT_SECRET,
                    grant_type: "authorization_code",
                    code: code.toString(),
                    redirect_uri: `${NEXT_PUBLIC_WEBSITE_HOST}/api/auth/twitter/redirect`,
                    code_verifier: "challenge",
                });

                const response = await axios.post(TOKEN_TWITTER_AUTH_URL, formData.toString(), {
                    headers: {
                        "Content-type": `application/x-www-form-urlencoded`,
                    },
                });

                if (!response || !response?.data?.access_token) {
                    throw new Error("Couldn't authenticate with Twitter Auth Oath2");
                }

                const userInfo = await axios.get(USERINFO_TWITTER_URL, {
                    headers: {
                        Authorization: `Bearer ${response.data.access_token}`,
                    },
                });

                if (!userInfo) {
                    throw new Error("Couldn't retrieve twitter info, pls retry later!");
                }

                // get current whitelist user
                let walletAddress = utils.getAddress(session.user.address);
                const whiteListUser = await prisma.whiteList.findUnique({
                    where: { wallet: walletAddress },
                });

                if (
                    whiteListUser.twitterId != null &&
                    (whiteListUser.twitterId.length > 0 || whiteListUser.twitterUserName.length > 0)
                ) {
                    return res.status(200).json({ message: "Already authenticated before" });
                }

                // get quest type of Enums.TWITTER_AUTH
                let questType = await prisma.questType.findUnique({
                    where: { name: Enums.TWITTER_AUTH },
                });

                if (!questType) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "Cannot find quest type twitter auth" });
                }

                // get quest of this type based on id
                let twitterQuest = await prisma.quest.findFirst({
                    where: {
                        questTypeId: questType.id,
                    },
                });

                // reward this user
                let userQuest = await updateUserAndAddRewardTransaction(
                    twitterQuest,
                    walletAddress,
                    userInfo.data.data
                );

                if (!userQuest) {
                    return res
                        .status(200)
                        .json({ message: "Cannot finish quest, pls contact administrator!" });
                }

                res.status(200).json({ message: "Quest completed, please close this page!" });
            } catch (err) {
                console.log(err);
                res.status(422).json({ error: err.message });
            }
            break;
        default:
            res.setHeader("Allow", ["GET", "PUT"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}

const updateUserAndAddRewardTransaction = async (quest, wallet, userInfo) => {
    let { questId, type, rewardTypeId, quantity, extendedQuestData } = quest;
    wallet = utils.getAddress(wallet);

    let claimedReward;

    console.log(`**Update user**`);
    const { id, username } = userInfo;

    if (!id || !username) {
        throw new Error("Cannot get twitter id or twitter username from auth");
    }

    const updatedUser = prisma.whiteList.update({
        where: { wallet },
        data: {
            twitterId: id,
            twitterUserName: username,
        },
    });

    console.log(`**Create / Update reward for user**`);
    claimedReward = prisma.reward.upsert({
        where: {
            wallet_rewardTypeId: { wallet, rewardTypeId },
        },
        update: {
            quantity: {
                increment: quantity,
            },
        },
        create: {
            wallet,
            quantity,
            rewardTypeId,
        },

        select: {
            wallet: true,
            quantity: true,
            user: true,
            rewardTypeId: true,
            rewardType: true,
        },
    });

    console.log(`**Save to UserQuest, to keep track that its done**`);
    let userQuest = prisma.userQuest.create({
        data: {
            wallet,
            questId,
            rewardedTypeId: rewardTypeId,
            rewardedQty: quantity,
        },
    });

    await prisma.$transaction([updatedUser, claimedReward, userQuest]);
    return userQuest;
};
