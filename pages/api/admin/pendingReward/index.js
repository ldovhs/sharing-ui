import discordInstance from "@context/DiscordContext";
import DiscordFactory from "@context/DiscordContext";
// import discord, { Intents, User } from "discord.js";
import { prisma } from "@context/PrismaContext";
import { getSession } from "next-auth/react";

export default async function PendingRewardAPI(req, res) {
    const { method } = req;
    const session = await getSession({ req });

    switch (method) {
        case "GET":
            try {
                const { username, generatedURL } = req.query;

                // search for username either from discord, or twitter
                let pendingReward = await prisma.pendingReward.findFirst({
                    where: {
                        OR: [
                            {
                                discordId: username,
                                generatedURL,
                            },
                            {
                                twitter: username,
                                generatedURL,
                            },
                        ],
                    },
                    include: {
                        rewardType: true,
                    },
                });

                res.status(200).json({ pendingReward, isError: false });
            } catch (err) {
                console.log(err);
                res.status(500).json({ err });
            }
            break;

        /* 
            0. Check if req is from an admin
            1. Look for user in database if exists
            2. Create a pending reward since we found the user
            3. Show in discord if ShowInDiscord is true
            4. TODO: Post on main Twitter account in order to get the tweetId for Tweeting later?
        */
        case "POST":
            if (!session.user?.isAdmin) {
                res.status(400).json({
                    message: "Not authenticated to send reward",
                    isError: true,
                });
            }

            try {
                const { username, type, wallet, rewardTypeId, quantity, showInDiscord } = req.body;

                let userCondition = { wallet };

                switch (type) {
                    case "Discord":
                        userCondition = { ...userCondition, discordId: username };
                        break;
                    case "Twitter":
                        userCondition = { ...userCondition, twitter: username };
                        break;
                    default:
                        throw new Error("Unknown type of social media user");
                }

                console.log(`***** New Pending Reward: Finding user wallet: ${wallet}`);
                let user = await prisma.whiteList.findFirst({
                    where: userCondition,
                });

                if (!user) {
                    res.status(200).json({
                        message: `Cannot find any user with ${
                            type === "Discord" ? "DiscordId" : "Twitter"
                        } : ${username}, on wallet ${wallet}.`,
                        isError: true,
                    });
                    return;
                }

                console.log(
                    `***** New Pending Reward: Create pending reward for user wallet: ${wallet}`
                );
                let pendingReward = await prisma.pendingReward.create({
                    data: {
                        wallet,
                        discordId: type === "Discord" ? username : "",
                        twitter: type === "Twitter" ? username : "",
                        tokens: quantity,
                        isClaimed: false,
                        rewardType: {
                            connect: {
                                id: parseInt(rewardTypeId),
                            },
                        },
                        user: {
                            connect: {
                                userId: user.userId,
                            },
                        },
                    },
                    include: {
                        rewardType: true,
                    },
                });

                if (pendingReward && showInDiscord) {
                    console.log(
                        `***** New Pending Reward: Create a discord message for pending reward...`
                    );

                    let discordClient = await discordInstance.getInstance();
                    if (discordClient) {
                        await discordClient.channels.cache.get("954167590677258245").send({
                            content: `**Aedi has granted *${username}* with ${quantity} ${pendingReward.rewardType.reward}** `,
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
