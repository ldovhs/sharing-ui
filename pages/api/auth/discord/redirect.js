import { prisma } from "@context/PrismaContext";
import axios from "axios";
import url from "url";
import { getSession } from "next-auth/react";
import { utils } from "ethers";
import Enums from "enums";
import { getWhitelistByWallet } from "repositories/whitelist";
import { isWhitelistUser } from "repositories/session-auth";

const TOKEN_DISCORD_AUTH_URL = "https://discord.com/api/oauth2/token";
const USERINFO_DISCORD_AUTH_URL = "https://discord.com/api/users/@me";

const { NEXT_PUBLIC_WEBSITE_HOST, NEXT_PUBLIC_DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } =
    process.env;

// @dev this is used for discord auth quest only
export default async function discordRedirect(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                const session = await getSession({ req });
                let lookupWallet = await isWhitelistUser(session);

                if (!session || !utils.isAddress(lookupWallet)) {
                    throw new Error("Unauthenticated user");
                }

                const { code } = req.query;
                if (!code) {
                    res.status(422).json({ message: "Missing auth code for oath2" });
                }

                const formData = new url.URLSearchParams({
                    client_id: NEXT_PUBLIC_DISCORD_CLIENT_ID,
                    client_secret: DISCORD_CLIENT_SECRET,
                    grant_type: "authorization_code",
                    code: code.toString(),
                    redirect_uri: `${NEXT_PUBLIC_WEBSITE_HOST}/api/auth/discord/redirect`,
                });

                const response = await axios.post(TOKEN_DISCORD_AUTH_URL, formData.toString(), {
                    headers: {
                        "Content-type": `application/x-www-form-urlencoded`,
                    },
                });

                if (!response || !response?.data?.access_token) {
                    throw new Error("Couldn't authenticate with Discord Auth");
                }

                const userInfo = await axios.get(USERINFO_DISCORD_AUTH_URL, {
                    headers: {
                        Authorization: `Bearer ${response.data.access_token}`,
                    },
                });

                if (!userInfo) {
                    throw new Error("Couldn't retrieve user info from auth");
                }

                // saving discordId, and discord discriminator into whitelist table

                const whiteListUser = await getWhitelistByWallet(lookupWallet);

                if (
                    whiteListUser.discordId != null &&
                    (whiteListUser.discordId.length > 0 ||
                        whiteListUser.discordUserDiscriminator.length > 0)
                ) {
                    return res.status(200).json({ message: "Already authenticated before" });
                }

                // get quest type of Enums.DISCORD_AUTH
                let questType = await prisma.questType.findUnique({
                    where: { name: Enums.DISCORD_AUTH },
                });

                if (!questType) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "Cannot find quest type discord auth" });
                }

                // get quest of this type based on id
                let discordQuest = await prisma.quest.findFirst({
                    where: {
                        questTypeId: questType.id,
                    },
                });

                // update user info and reward (transaction)
                let userQuest = await updateUserAndAddRewardTransaction(
                    discordQuest,
                    lookupWallet,
                    userInfo.data
                );

                if (!userQuest) {
                    return res
                        .status(200)
                        .json({ message: "Cannot finish quest, pls contact administrator!" });
                }

                res.status(200).json({ message: "Discord authenticattion quest completed!" });
            } catch (err) {
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

    let extendedUserQuestData = { ...extendedQuestData };
    let claimedReward;
    if (quantity >= 0) {
    }

    console.log(`**Update user**`);
    const { id, username, discriminator } = userInfo;
    const updatedUser = prisma.whiteList.update({
        where: { wallet },
        data: {
            discordId: id,
            discordUserDiscriminator: `${username}#${discriminator}`,
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
