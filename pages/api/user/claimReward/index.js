import { prisma } from "@context/PrismaContext";
import { getSession } from "next-auth/react";
import axios from "axios";
import Enums from "enums";
import { isWhitelistUser } from "repositories/session-auth";

const { DISCORD_NODEJS, DISCORD_REWARD_CHANNEL, NEXT_PUBLIC_WEBSITE_HOST } = process.env;

/* api/claimReward */
export default async function ClaimRewardAPI(req, res) {
    const { method } = req;
    const session = await getSession({ req });
    let userWallet = await isWhitelistUser(session);
    if (!userWallet) {
        return res.status(422).json({
            message: "Not authenticated for reward route",
            isError: true,
        });
    }

    switch (method) {
        case "GET":
            try {
                const rewarded = await prisma.reward.findMany({
                    where: { wallet: userWallet },
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
                console.log(111);
                console.log(`** Checking if proper wallet ${wallet} is claiming the reward **`);
                if (userWallet !== wallet) {
                    return res.status(400).json({
                        message: "Not authenticated to claim this reward.",
                        isError: true,
                    });
                }

                console.log(`** Assure this reward ${generatedURL} exists and not claimed **`);
                const pendingReward = await prisma.pendingReward.findUnique({
                    where: {
                        wallet_rewardTypeId_generatedURL: {
                            wallet: userWallet,
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
                        userWallet,
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
                        wallet: userWallet,
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
                            }
                            // { authorization
                            //     headers: {
                            //         Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
                            //         "Content-Type": "application/json",
                            //     },
                            // }
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
    userWallet,
    rewardTypeId,
    quantity,
    generatedURL
) => {
    console.log(`** Claiming Reward ${generatedURL} **`);
    let claimedReward = prisma.reward.upsert({
        where: {
            wallet_rewardTypeId: { wallet: userWallet, rewardTypeId },
        },
        create: {
            wallet: userWallet,
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
                wallet: userWallet,
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
