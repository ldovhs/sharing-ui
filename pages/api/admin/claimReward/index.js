import { prisma } from "@context/PrismaContext";
import { getSession } from "next-auth/react";
import axios from "axios";
import Enums from "enums";

const { DISCORD_NODEJS, DISCORD_REWARD_CHANNEL, NEXT_PUBLIC_WEBSITE_HOST } = process.env;

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
            3. Post in discord that the reward has been claimed
        */
        case "POST":
            try {
                const { generatedURL, isClaimed, rewardTypeId, quantity, userId, wallet } =
                    req.body;

                console.log(`***** Checking if proper wallet ${wallet} is claiming the reward`);
                if (session.user?.address.toLowerCase() === wallet) {
                    res.status(400).json({
                        message: "Not authenticated to claim this reward.",
                        isError: true,
                    });
                }

                console.log(`**Assure this pending reward ${generatedURL} exists and not claimed`);
                const pendingReward = await prisma.pendingReward.findUnique({
                    where: {
                        wallet_rewardTypeId_generatedURL: {
                            wallet,
                            rewardTypeId,
                            generatedURL,
                        },
                    },
                });

                if (!pendingReward) {
                    res.status(200).json({
                        isError: true,
                        message: `Cannot find reward associated to user ${wallet}, url ${generatedURL} , please contact administrator!`,
                    });
                    return;
                }

                let claimedReward;
                if (!pendingReward.isClaimed) {
                    console.log(`** Claiming Reward ${generatedURL}`);
                    claimedReward = await prisma.reward.upsert({
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
                }

                if (!claimedReward) {
                    res.status(200).json({
                        isError: true,
                        message: `Reward cannot be claimed for user ${wallet} or already claimed, userId ${userId} , please contact administrator!`,
                    });
                    return;
                }

                console.log(`***** Updating pending reward ${generatedURL} to claimed`);
                await prisma.pendingReward.update({
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

                let user = await prisma.whiteList.findUnique({
                    where: {
                        wallet,
                    },
                });

                if (user && user.discordId.length > 0) {
                    if (claimedReward.user.discordId.trim().length > 0) {
                        claimedReward.claimedUser = `<@${claimedReward.user.discordId.trim()}>`;
                    } else {
                        claimedReward.claimedUser = claimedReward.user.wallet;
                    }

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

/* 
if (user && user.discordId.length > 0) {
let discordClient = await discordInstance.getInstance();

if (discordClient) {
    let claimedRewardUser;

    const Guilds = await discordClient.guilds.cache.map((guild) => guild);

    if (claimedReward.user.discordId.trim().length > 0) {
        claimedRewardUser = await Guilds[0].members
            .fetch(claimedReward.user.discordId)
            .catch(console.error);
    } else {
        claimedRewardUser = claimedReward.user.wallet;
    }

    await discordClient.channels.cache.get(rewardChannel).send({
        content: `** *${claimedRewardUser}* has claimed their free ${claimedReward.rewardType.reward}** `,
        embeds: [
            {
                image: {
                    url: "https://anomura-landing.vercel.app/img/home/shop.gif",
                },
            },
        ],
    });
}

*/
