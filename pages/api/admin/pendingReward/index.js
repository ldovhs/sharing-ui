import { prisma } from "@context/PrismaContext";
import { getSession } from "next-auth/react";
import Enums from "enums";
import axios from "axios";

const { DISCORD_BOT_ID, DISCORD_BOT_TOKEN, DISCORD_REWARD_CHANNEL, NEXT_PUBLIC_WEBSITE_HOST } =
    process.env;

export default async function PendingRewardAPI(req, res) {
    const { method } = req;
    const session = await getSession({ req });

    switch (method) {
        /* Get pending reward from db*/
        case "GET":
            try {
                const { username, generatedURL } = req.query;

                /* Finding user info from WhiteList based on username*/

                console.log(`***** Finding user wallet for pending reward, username: ${username}`);

                let user = await prisma.whiteList.findFirst({
                    where: {
                        OR: [
                            {
                                discordId: username,
                            },
                            {
                                twitter: username,
                            },
                            {
                                wallet: username,
                            },
                        ],
                    },
                });

                //console.log(user);

                if (!user) {
                    return res.status(200).json({
                        message: `Cannot find record for user ${username}`,
                        isError: true,
                    });
                }

                /* search for pending reward from the wallet info */
                let pendingReward = await prisma.pendingReward.findFirst({
                    where: {
                        generatedURL,
                        wallet: user.wallet,
                    },
                    include: {
                        rewardType: true,
                    },
                });
                if (!pendingReward) {
                    return res.status(200).json({
                        message: `Pending reward null, mostly user does not own this reward`,
                        isError: true,
                    });
                }

                console.log(pendingReward);

                res.status(200).json({ pendingReward, isError: false });
            } catch (err) {
                console.log(err);
                res.status(500).json({ err });
            }
            break;

        case "POST":
            /*  
                @dev Create a new pending reward

                0. Check if req is from an admin
                1. Look for user in database if exists
                2. Create a pending reward since we found the user
                3. Show in discord if ShowInDiscord is true
                4. TODO: Post on main Twitter account in order to get the tweetId for Tweeting later?
            */
            //console.log(session);
            if (!session || !session.user?.isAdmin) {
                return res.status(400).json({
                    message: "Not authenticated to send reward",
                    isError: true,
                });
            }

            try {
                const { username, type, wallet, rewardTypeId, quantity, showInDiscord } = req.body;

                let userCondition = { wallet };

                if (type === Enums.DISCORD && username.trim().length > 0) {
                    userCondition = { ...userCondition, discordId: username };
                }
                if (type === Enums.TWITTER && username.trim().length > 0) {
                    userCondition = { ...userCondition, twitter: username };
                }
                if (username.trim().length === 0) {
                    userCondition = { ...userCondition, wallet };
                }

                console.log(`***** New Pending Reward: Finding user wallet: ${wallet}`);
                let user = await prisma.whiteList.findFirst({
                    where: userCondition,
                });

                if (!user) {
                    res.status(200).json({
                        message: `Cannot find any user with ${
                            type === Enums.DISCORD ? "Discord Id" : "Twitter"
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
                        //wallet,
                        quantity,
                        isClaimed: false,
                        rewardType: {
                            connect: {
                                id: parseInt(rewardTypeId),
                            },
                        },
                        user: {
                            connect: {
                                wallet: user.wallet,
                            },
                        },
                    },
                    include: {
                        rewardType: true,
                        user: true,
                    },
                });

                if (
                    pendingReward &&
                    // type === EnumAuth.DISCORD &&
                    // username.trim().length > 0 &&
                    showInDiscord
                ) {
                    let imageUrl;

                    switch (pendingReward.rewardType.reward) {
                        case Enums.REWARDTYPE.MYSTERYBOWL:
                            imageUrl = `${NEXT_PUBLIC_WEBSITE_HOST}/img/sharing-ui/invite/shop.gif`;
                            break;
                        case Enums.REWARDTYPE.NUDE:
                            imageUrl = `${NEXT_PUBLIC_WEBSITE_HOST}/img/sharing-ui/invite/15.gif`;
                            break;
                        case Enums.REWARDTYPE.BOREDAPE:
                            imageUrl = `${NEXT_PUBLIC_WEBSITE_HOST}/img/sharing-ui/invite/11.gif`;
                            break;
                        case Enums.REWARDTYPE.MINTLIST:
                            imageUrl = `${NEXT_PUBLIC_WEBSITE_HOST}/img/sharing-ui/invite/chest_opened_175f.gif`;
                            break;
                        default:
                            imageUrl = `${NEXT_PUBLIC_WEBSITE_HOST}/img/sharing-ui/invite/shop.gif`;
                            break;
                    }

                    let receivingUser;
                    if (pendingReward.user.discordId.trim().length > 0) {
                        receivingUser = `<@${pendingReward.user.discordId.trim()}>`;
                    } else {
                        receivingUser = pendingReward.user.wallet;
                    }

                    let discordPost = await axios.post(
                        `https://discord.com/api/channels/${DISCORD_REWARD_CHANNEL}/messages`,
                        {
                            content: `** <@${DISCORD_BOT_ID}> has granted *${receivingUser}* with ${quantity} ${pendingReward.rewardType.reward}** `, // `** ${bot} has granted *${receivingUser}*
                            embeds: [
                                {
                                    image: {
                                        url: imageUrl,
                                    },
                                },
                            ],
                        },
                        {
                            headers: {
                                Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );
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

/* for discord Client javascript when nextjs use node v16

 import discordInstance from "@context/DiscordContext";

 let discordClient = await discordInstance.getInstance();

 if (discordClient) {
     console.log(
         `***** New Pending Reward: Create a discord message for pending reward...`
     );

     let imageUrl;

     switch (pendingReward.rewardType.reward) {
         case Enums.REWARDTYPE.MYSTERYBOWL:
             imageUrl = `${process.env.NEXT_PUBLIC_WEBSITE_HOST}/img/sharing-ui/invite/shop.gif`;
             break;
         case Enums.REWARDTYPE.NUDE:
             imageUrl = `${process.env.NEXT_PUBLIC_WEBSITE_HOST}/img/sharing-ui/invite/15.webp`;
             break;
         case Enums.REWARDTYPE.BOREDAPE:
             imageUrl = `${process.env.NEXT_PUBLIC_WEBSITE_HOST}/img/sharing-ui/invite/11.webp`;
             break;
         case Enums.REWARDTYPE.MINTLIST:
             imageUrl = `${process.env.NEXT_PUBLIC_WEBSITE_HOST}/img/sharing-ui/invite/chest_opened_175f.webp`;
             break;
         default:
             imageUrl = `${process.env.NEXT_PUBLIC_WEBSITE_HOST}/img/sharing-ui/invite/chest_opened_175f.webp`;
             break;
     }

     let receivingUser;
     const Guilds = await discordClient.guilds.cache.map((guild) => guild);

     const bot = await Guilds[0].members
         .fetch(process.env.NEXT_PUBLIC_DISCORD_BOT)
         .catch(console.error);

     if (pendingReward.user.discordId.trim().length > 0) {
         receivingUser = await Guilds[0].members
             .fetch(pendingReward.user.discordId)
             .catch(console.error);
     } else {
         receivingUser = pendingReward.user.wallet;
     }

     console.log(receivingUser);

     await discordClient?.channels?.cache
         ?.get(process.env.NEXT_PUBLIC_DISCORD_REWARD_CHANNEL)
         .send({
             content: `** ${bot} has granted *${receivingUser}* with ${quantity} ${pendingReward.rewardType.reward}** `,
             embeds: [
                 {
                     image: {
                         url: imageUrl,
                     },
                 },
             ],
         });
 }
*/
