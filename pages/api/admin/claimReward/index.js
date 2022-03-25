import { prisma } from "../../../../context/PrismaContext";
import { getSession } from "next-auth/react";

const rewardChannel = "954167590677258245";

/* api/claimReward */
export default async function ClaimRewardAPI(req, res) {
    const { method } = req;
    const session = await getSession({ req });

    switch (method) {
        case "GET":
            try {
            } catch (err) {
                console.log(err);
                res.status(500).json({ err });
            }
            break;

        /* 
            1. Insert a record into Reward table
            2. Mark the record as claimed in Pending Reward table
            3. TODO: Post in discord that the reward has been claim
        */
        case "POST":
            try {
                const {
                    discordId,
                    generatedURL,
                    isClaimed,
                    rewardTypeId,
                    tokens,
                    twitter,
                    userId,
                    wallet,
                } = req.body;

                console.log(`***** Checking if wallet ${wallet} is claiming the reward`);
                if (session.user?.address.toLowerCase() === wallet) {
                    res.status(400).json({
                        message: "Not authenticated to claim reward",
                        isError: true,
                    });
                }

                console.log(
                    `***** Assure this pending reward ${generatedURL} exists and not claimed`
                );
                const pendingReward = await prisma.pendingReward.findFirst({
                    where: {
                        OR: [
                            {
                                discordId,
                                wallet,
                                rewardTypeId,
                                tokens,
                                generatedURL,
                                userId,
                                isClaimed,
                            },
                            {
                                twitter: twitter,
                                wallet,
                                rewardTypeId,
                                tokens,
                                generatedURL,
                                userId,
                                isClaimed,
                            },
                        ],
                    },
                });

                if (!pendingReward) {
                    res.status(200).json({
                        isError: true,
                        message: `Cannot find reward associated to user ${
                            discordId || twitter
                        }, url ${generatedURL} , please contact administrator!`,
                    });
                    return;
                }

                let claimedReward;
                console.log();
                if (!pendingReward.isClaimed) {
                    console.log(
                        `***** Claimedreward ${generatedURL}, creating new or update existing one`
                    );
                    claimedReward = await prisma.reward.upsert({
                        where: {
                            wallet_rewardTypeId: { wallet, rewardTypeId },
                        },
                        create: {
                            discordId: discordId ?? "",
                            twitter: twitter ?? "",
                            wallet,
                            tokens,
                            userId,
                            rewardTypeId,
                        },
                        update: {
                            tokens: {
                                increment: tokens,
                            },
                        },
                    });
                }
                if (!claimedReward) {
                    res.status(200).json({
                        isError: true,
                        message: `Reward cannot be claimed for user ${
                            discordId || twitter
                        } or already claimed, userId ${userId} , please contact administrator!`,
                    });
                    return;
                }

                console.log(`***** Updating pending reward ${generatedURL} to claimed`);
                await prisma.pendingReward.update({
                    where: {
                        wallet_rewardTypeId_generatedURL_tokens: {
                            wallet,
                            rewardTypeId,
                            generatedURL,
                            tokens,
                        },
                    },
                    data: {
                        isClaimed: true,
                    },
                });

                if (discordId.length > 0) {
                    let discordClient = await discordInstance.getInstance();
                    if (discordClient) {
                        await discordClient.channels.cache.get(rewardChannel).send({
                            content: `** *${discordId}* has claimed their free ${pendingReward.rewardType.reward}** `,
                            embeds: [
                                {
                                    image: {
                                        url: "https://anomura-landing.vercel.app/img/home/shop.gif",
                                    },
                                },
                            ],
                        });
                    }
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
