import { prisma } from "@context/PrismaContext";
import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";
import axios from "axios";
import Enums from "enums";
import { UpdateClaimAndPendingRewardTransaction } from "repositories/transactions";

const { DISCORD_NODEJS, DISCORD_BOT_CHANNEL, NEXT_PUBLIC_WEBSITE_HOST, NODEJS_SECRET } =
    process.env;

const ROUTE = "/api/user/reward/claim";

const userClaimRewardAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            try {
                const whiteListUser = req.whiteListUser;
                const { generatedURL, isClaimed, rewardTypeId, quantity, userId, wallet } =
                    req.body;

                console.log(`** Checking if proper wallet ${wallet} is claiming the reward **`);
                if (whiteListUser.wallet !== wallet) {
                    return res.status(200).json({
                        message: "Not authenticated to claim this reward.",
                        isError: true,
                    });
                }

                console.log(`** Assure this reward ${generatedURL} exists and not claimed **`);
                const pendingReward = await prisma.pendingReward.findUnique({
                    where: {
                        wallet_rewardTypeId_generatedURL: {
                            wallet: whiteListUser.wallet,
                            rewardTypeId,
                            generatedURL,
                        },
                    },
                });

                if (!pendingReward) {
                    return res.status(200).json({
                        isError: true,
                        message: `Cannot find reward associated to user ${wallet}, url ${generatedURL}, please contact administrator!`,
                    });
                }

                if (pendingReward.isClaimed) {
                    return res.status(200).json({
                        isError: true,
                        message: `Reward is claimed previously!`,
                    });
                }

                let claimedReward = await UpdateClaimAndPendingRewardTransaction(
                    whiteListUser.wallet,
                    rewardTypeId,
                    quantity,
                    generatedURL
                );

                if (!claimedReward) {
                    return res.status(200).json({
                        isError: true,
                        message: `Reward cannot be claimed for user ${wallet} or already claimed, userId ${userId}, please contact administrator!`,
                    });
                }

                // post to discord if discordId exists
                if (
                    whiteListUser &&
                    whiteListUser.discordId !== null &&
                    whiteListUser.discordId.length > 0
                ) {
                    claimedReward.claimedUser = `<@${whiteListUser.discordId.trim()}>`;

                    switch (claimedReward.rewardType.reward) {
                        case Enums.REWARDTYPE.MYSTERYBOWL:
                            claimedReward.imageUrl = `${NEXT_PUBLIC_WEBSITE_HOST}/challenger/img/sharing-ui/invite/shop.gif`;
                            break;
                        case Enums.REWARDTYPE.NUDE:
                            claimedReward.imageUrl = `${NEXT_PUBLIC_WEBSITE_HOST}/challenger/img/sharing-ui/invite/15.gif`;
                            break;
                        case Enums.REWARDTYPE.BOREDAPE:
                            claimedReward.imageUrl = `${NEXT_PUBLIC_WEBSITE_HOST}/challenger/img/sharing-ui/invite/11.gif`;
                            break;
                        case Enums.REWARDTYPE.MINTLIST:
                            claimedReward.imageUrl = `${NEXT_PUBLIC_WEBSITE_HOST}/challenger/img/sharing-ui/invite/Mintlist-Reward.gif`;
                            break;
                        case Enums.REWARDTYPE.SHELL:
                            claimedReward.imageUrl = `${NEXT_PUBLIC_WEBSITE_HOST}/challenger/img/sharing-ui/invite/Shell-Reward.gif`;
                            break;
                        default:
                            claimedReward.imageUrl = `${NEXT_PUBLIC_WEBSITE_HOST}/challenger/img/sharing-ui/invite/Shell-Reward.gif.gif`;
                            break;
                    }

                    let discordPost = await axios
                        .post(
                            `${DISCORD_NODEJS}/api/v1/channels/claimedReward`,
                            {
                                claimedReward,
                            },
                            {
                                //authorization
                                headers: {
                                    Authorization: `Bot ${NODEJS_SECRET}`,
                                    "Content-Type": "application/json",
                                },
                            }
                        )
                        .catch((err) => {
                            console.log(err);
                        });
                }

                res.status(200).json(pendingReward);
            } catch (err) {
                console.log(err);
                res.status(500).json({ err });
            }
            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default whitelistUserMiddleware(userClaimRewardAPI);
