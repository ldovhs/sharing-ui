import { getAllEnableQuestsForUser, getQuestsDoneByThisUser } from "repositories/quest";
import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";
import Enums from "enums";
import { prisma } from "@context/PrismaContext";

const ROUTE = "/api/user/userquests";
const ITEM_PER_PAGE = Enums.ITEM_PER_PAGE;
const questQueryAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                // let wallet = utils.getAddress(whiteListUser.wallet);

                const { eventName, page } = req.query;

                let questType = await prisma.questType.findMany({});
                let imageQuest = questType.find(q => q.name === Enums.IMAGE_UPLOAD_QUEST)
                if (!imageQuest) {
                    throw new Error("Cannot find any quest of type image upload")
                }

                let allImageQuests = await prisma.quest.findMany({
                    where: {
                        questTypeId: imageQuest.id,
                    },
                });

                if (!allImageQuests) {
                    throw new Error("Cannot find image quests")
                }

                console.log(`** Get all user quests of id **`);
                let currentImageQuest = allImageQuests.find(q => q.extendedQuestData.eventName.toLowerCase() === eventName.toLowerCase());

                if (!currentImageQuest) {
                    throw new Error(`Cannot find image quest of this event name ${eventName}`)
                }


                let allUserQuestsOfThisQuestId = await prisma.userQuest.findMany({
                    where: {
                        questId: currentImageQuest.questId,
                    },
                });

                let userQuests = await prisma.userQuest.findMany({
                    where: {
                        questId: currentImageQuest.questId,
                    },
                    skip: page * ITEM_PER_PAGE,
                    take: ITEM_PER_PAGE,
                    // orderBy: [
                    //     {
                    //         updatedAt: "asc",
                    //     },
                    // ],
                    include: {
                        user: true,
                    },
                });

                /* filter userQuests with messageId*/

                return res.status(200).json({
                    isError: false,
                    data: userQuests,
                    count: allUserQuestsOfThisQuestId.length,
                });
            } catch (err) {
                console.log(err);
                res.status(500).json({ err });
            }
            break;

        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};
export default whitelistUserMiddleware(questQueryAPI);
