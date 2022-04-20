import { prisma } from "@context/PrismaContext";
import { getSession } from "next-auth/react";
import axios from "axios";
import Enums from "enums";
import { isWhiteListUser } from "repositories/session-auth";

const { DISCORD_NODEJS, DISCORD_REWARD_CHANNEL, NEXT_PUBLIC_WEBSITE_HOST, DISCORD_BOT_TOKEN } =
    process.env;

/* api/claimReward */
export default async function ClaimReward(req, res) {
    const { method } = req;
    const session = await getSession({ req });
    let whiteListUser = await isWhiteListUser(session);
    if (!whiteListUser) {
        return res.status(422).json({
            message: "Not authenticated for reward route",
            isError: true,
        });
    }

    switch (method) {
        case "GET":
            try {
                const rewarded = await prisma.reward.findMany({
                    where: { wallet: whiteListUser.wallet },
                    include: { rewardType: true },
                });

                res.status(200).json(rewarded);
            } catch (error) {
                console.log(err);
                res.status(500).json({ err });
            }
            break;
        /* 
            1. Insert a record into Reward table
            2. Mark the record as claimed in Pending Reward table
            3. Post in discord that the reward has been claimed
        */
        case "POST":
            try {
                const { generatedURL, isClaimed, rewardTypeId, quantity, userId, wallet } =
                    req.body;

                console.log(`** Checking if proper wallet ${wallet} is claiming the reward **`);
                if (whiteListUser.wallet !== wallet) {
                    return res.status(422).json({
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

                let claimedReward;
                if (!pendingReward.isClaimed) {
                    claimedReward = await UpdateClaimAndPendingRewardTransaction(
                        whiteListUser.wallet,
                        rewardTypeId,
                        quantity,
                        generatedURL
                    );
                }

                if (!claimedReward) {
                    return res.status(200).json({
                        isError: true,
                        message: `Reward cannot be claimed for user ${wallet} or already claimed, userId ${userId}, please contact administrator!`,
                    });
                }

                console.log("** Find user **");
                let user = await prisma.whiteList.findUnique({
                    where: {
                        wallet: whiteListUser.wallet,
                    },
                });

                if (user && user.discordId !== null) {
                    claimedReward.claimedUser = `<@${user.discordId.trim()}>`;

                    switch (claimedReward.rewardType.reward) {
                        case Enums.REWARDTYPE.MYSTERYBOWL:
                            claimedReward.imageUrl = `${NEXT_PUBLIC_WEBSITE_HOST}/img/sharing-ui/invite/shop.gif`;
                            break;
                        case Enums.REWARDTYPE.NUDE:
                            claimedReward.imageUrl = `${NEXT_PUBLIC_WEBSITE_HOST}/img/sharing-ui/invite/15.gif`;
                            break;
                        case Enums.REWARDTYPE.BOREDAPE:
                            claimedReward.imageUrl = `${NEXT_PUBLIC_WEBSITE_HOST}/img/sharing-ui/invite/11.gif`;
                            break;
                        case Enums.REWARDTYPE.MINTLIST:
                            claimedReward.imageUrl = `${NEXT_PUBLIC_WEBSITE_HOST}/img/sharing-ui/invite/chest_opened_175f.gif`;
                            break;
                        default:
                            claimedReward.imageUrl = `${NEXT_PUBLIC_WEBSITE_HOST}/img/sharing-ui/invite/shop.gif`;
                            break;
                    }

                    let discordPost = await axios
                        .post(
                            `${DISCORD_NODEJS}/api/v1/channels/${DISCORD_REWARD_CHANNEL}/claimedReward`,
                            {
                                claimedReward,
                            },
                            {
                                //authorization
                                headers: {
                                    Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
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
            res.setHeader("Allow", ["GET", "PUT"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}

const UpdateClaimAndPendingRewardTransaction = async (
    wallet,
    rewardTypeId,
    quantity,
    generatedURL
) => {
    console.log(`** Claiming Reward ${generatedURL} **`);
    let claimedReward = prisma.reward.upsert({
        where: {
            wallet_rewardTypeId: { wallet, rewardTypeId },
        },
        create: {
            wallet,
            quantity,
            rewardTypeId,
        },
        update: {
            quantity: {
                increment: quantity,
            },
        },
        select: {
            wallet: true,
            quantity: true,
            user: true,
            rewardTypeId: true,
            rewardType: true,
        },
    });

    console.log(`** Updating reward ${generatedURL} to claimed **`);
    let updatePendingReward = prisma.pendingReward.update({
        where: {
            wallet_rewardTypeId_generatedURL: {
                wallet,
                rewardTypeId,
                generatedURL,
            },
        },
        data: {
            isClaimed: true,
        },
    });

    await prisma.$transaction([claimedReward, updatePendingReward]);
    return claimedReward;
};
