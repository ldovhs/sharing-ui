import { prisma } from "@context/PrismaContext";
import { getSession } from "next-auth/react";
import axios from "axios";

const { DISCORD_BOT_ID, DISCORD_BOT_TOKEN, DISCORD_REWARD_CHANNEL, NEXT_PUBLIC_WEBSITE_HOST } =
    process.env;

export default async function getQuestLeaderBoard(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                const { questId } = req.query;

                let questData = await prisma.quest.findUnique({
                    where: { questId },
                    include: {
                        userQuests: {
                            include: {
                                user: true,
                            },
                        },
                    },
                });
                console.log(questData);
                if (!questData) {
                    return res.status(200).json({ isError: true, message: "Not a valid quest." });
                }
                if (questData.userQuests.length == 0) {
                    return res.status(200).json(questData);
                }

                if (questData.userQuests.length > 0) {
                    let discordChannel =
                        questData.userQuests[0].extendedUserQuestData.discordChannel;

                    let channelMessages = await axios.get(
                        `https://discord.com/api/channels/${discordChannel}/messages`,

                        {
                            headers: {
                                Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    let result = await Promise.all(
                        questData.userQuests.map(async (q) => {
                            let messageId = q.extendedUserQuestData.messageId;

                            let messageIdInChannel = channelMessages.data.find(
                                (m) => m.id == messageId
                            );

                            if (messageIdInChannel.hasOwnProperty("reactions")) {
                                messageIdInChannel.reactions.map((r) => {
                                    if (r.emoji.name === "🍓") {
                                        console.log(r);
                                        q.extendedUserQuestData.messageReactions = {
                                            count: r.count,
                                        };
                                    } else {
                                        q.extendedUserQuestData.messageReactions = {
                                            count: 0,
                                        };
                                    }
                                });
                            } else {
                                q.extendedUserQuestData.messageReactions = {
                                    count: 0,
                                };
                            }

                            q.extendedUserQuestData.discordUser = q.user.discordId;
                            return q;
                        })
                    );

                    res.status(200).json(questData);
                }
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
