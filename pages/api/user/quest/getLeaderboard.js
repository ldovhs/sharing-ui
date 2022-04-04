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
                    // select: {
                    //     userQuests: true,
                    // },
                    include: {
                        userQuests: true,
                    },
                });

                if (questData) {
                    let discordChannel =
                        questData.userQuests[0].extendedUserQuestData.discordChannel;

                    let result = await Promise.all(
                        questData.userQuests.map(async (q) => {
                            let messageId = q.extendedUserQuestData.messageId;
                            let userMessage = await axios.get(
                                `https://discord.com/api/channels/${discordChannel}/messages/${messageId}`,

                                {
                                    headers: {
                                        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
                                        "Content-Type": "application/json",
                                    },
                                }
                            );
                            if (userMessage.data.reactions) {
                                userMessage.data.reactions.map((r) => {
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

                            return q;
                        })
                    );

                    // // (promise);
                    // console.log(result[0].extendedUserQuestData);
                    // console.log(result[1].extendedUserQuestData);
                    res.status(200).json(questData);
                } else {
                    return res.status(200).json({ isError: true, message: "Not a valid quest." });
                }
                // console.log(questData);
                // console.log(questData.userQuests);
            } catch (err) {
                console.log(err);
                res.status(500).json({ err });
            }
            break;
        case "POST":
            throw new Error("Not implemented");

            break;
        default:
            res.setHeader("Allow", ["GET", "PUT"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
