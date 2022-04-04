import { prisma } from "context/PrismaContext";
import { getSession } from "next-auth/react";
import Enums from "enums";

/* non protected route*/
export default async function QuestUpsert(req, res) {
    const { method } = req;
    const session = await getSession({ req });

    switch (method) {
        case "GET":
            try {
                throw new Error("Not implemented");
                res.status(200).json(types);
            } catch (err) {
                console.log(err);
                res.status(500).json({ err });
            }
            break;

        case "POST":
            /*  
                @dev Create a new quest
            */
            //console.log(session);
            if (!session || !session.user?.isAdmin) {
                return res.status(400).json({
                    message: "Not authenticated to upsert quest",
                    isError: true,
                });
            }

            try {
                const {
                    id,
                    type,
                    description,
                    text,
                    completedText,
                    rewardTypeId,
                    quantity,
                    isEnabled,
                    isRequired,
                    extendedQuestData,
                } = req.body;
                console.log(req.body);

                //TODO add guard for app submission app request
                let newExtendedQuestData;
                if (id === 0) {
                    //try to look for any existing quest with type == Discord auth or twitter auth before creating a new quest
                    let existingQuests = await prisma.quest.findMany();

                    let discordAuthQuest = existingQuests.filter(
                        (q) => q.type === Enums.DISCORD_AUTH
                    );

                    let twitterAuthQuest = existingQuests.filter(
                        (q) => q.type === Enums.TWITTER_AUTH
                    );

                    if (
                        (discordAuthQuest?.length >= 1 && type === Enums.DISCORD_AUTH) ||
                        (twitterAuthQuest?.length >= 1 && type === Enums.TWITTER_AUTH)
                    ) {
                        return res.status(200).json({
                            message: `Cannot add more than one quest of this quest type ${type} `,
                            isError: true,
                        });
                    }
                } else {
                    // updating, we need to get original extendedQuestData and create a new object to avoid data loss
                    let originalQuest = await prisma.quest.findUnique({
                        where: { id },
                    });

                    if (originalQuest) {
                        console.log(originalQuest.extendedQuestData);
                        newExtendedQuestData = {
                            ...originalQuest.extendedQuestData,
                            ...extendedQuestData,
                        };
                    }
                }

                console.log(`***** Upsert a quest`);
                let newQuest = await prisma.quest.upsert({
                    where: {
                        id: id || -1,
                    },
                    create: {
                        type,
                        description,
                        text,
                        completedText,
                        rewardType: {
                            connect: {
                                id: parseInt(rewardTypeId),
                            },
                        },
                        quantity,
                        isEnabled,
                        isRequired,
                        extendedQuestData,
                    },
                    update: {
                        description,
                        text,
                        completedText,
                        rewardType: {
                            connect: {
                                id: parseInt(rewardTypeId),
                            },
                        },
                        quantity,
                        isEnabled,
                        //isRequired,
                        extendedQuestData: newExtendedQuestData,
                    },
                });

                res.status(200).json(newQuest);
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
