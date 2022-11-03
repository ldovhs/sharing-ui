import { prisma } from "@context/PrismaContext";
import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";
import axios from "axios";
import Enums from "enums";
import { UpdateClaimAndPendingRewardTransaction } from "repositories/transactions";

const { DISCORD_NODEJS, NEXT_PUBLIC_WEBSITE_HOST, NODEJS_SECRET, NEXT_PUBLIC_ORIGIN_HOST } =
    process.env;

const userClaimRewardAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            try {
                if (process.env.NEXT_PUBLIC_ENABLE_CHALLENGER === "false") {
                    return res.status(200).json({ isError: true, message: "Challenger is not enabled." });
                }
                const whiteListUser = req.whiteListUser;
                const { generatedURL, isClaimed, rewardTypeId, quantity, userId, wallet } =
                    req.body;


                // DO NOT USE THE QUANTITY SENT TO API, USE THE QUANTITY QUERIED FROM DB
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
                    include: {
                        rewardType: true,
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

                let claimReward = await UpdateClaimAndPendingRewardTransaction(
                    whiteListUser,
                    rewardTypeId,
                    pendingReward.quantity,
                    generatedURL
                );

                if (!claimReward) {
                    return res.status(200).json({
                        isError: true,
                        message: `Reward cannot be claimed for user ${wallet} or already claimed, userId ${userId}, please contact administrator!`,
                    });
                }

                // post to discord if discordId exists
                if (claimReward) {
                    if (
                        whiteListUser.discordId != null &&
                        whiteListUser.discordId.trim().length > 0
                    ) {
                        pendingReward.claimedUser = `<@${whiteListUser.discordId.trim()}>`;
                    } else {
                        pendingReward.claimedUser = whiteListUser.wallet;
                    }

                    switch (pendingReward.rewardType.reward) {
                        case Enums.REWARDTYPE.MYSTERYBOWL:
                            pendingReward.imageUrl = `${NEXT_PUBLIC_ORIGIN_HOST}/challenger/img/sharing-ui/invite/shop.gif`;
                            break;
                        case Enums.REWARDTYPE.NUDE:
                            pendingReward.imageUrl = `${NEXT_PUBLIC_ORIGIN_HOST}/challenger/img/sharing-ui/invite/15.gif`;
                            break;
                        case Enums.REWARDTYPE.BOREDAPE:
                            pendingReward.imageUrl = `${NEXT_PUBLIC_ORIGIN_HOST}/challenger/img/sharing-ui/invite/11.gif`;
                            break;
                        case Enums.REWARDTYPE.MINTLIST:
                            pendingReward.imageUrl = `${NEXT_PUBLIC_ORIGIN_HOST}/challenger/img/sharing-ui/invite/Mintlist-Reward.gif`;
                            break;
                        case Enums.REWARDTYPE.SHELL:
                            pendingReward.imageUrl = `${NEXT_PUBLIC_ORIGIN_HOST}/challenger/img/sharing-ui/invite/Shell-Reward.gif`;
                            break;
                        default:
                            pendingReward.imageUrl = `${NEXT_PUBLIC_ORIGIN_HOST}/challenger/img/sharing-ui/invite/Shell-Reward.gif`;
                            break;
                    }

                    console.log(pendingReward.imageUrl);

                    let discordPost = await axios
                        .post(
                            `${DISCORD_NODEJS}/api/v1/channels/claimedReward`,
                            {
                                pendingReward,
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
                            return res.status(200).json({ isError: true, message: err.message });
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
