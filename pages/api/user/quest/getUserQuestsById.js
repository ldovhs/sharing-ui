import { getAllEnableQuestsForUser, getQuestsDoneByThisUser } from "repositories/quest";
import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";
import Enums from "enums";
import { prisma } from "@context/PrismaContext";

const ROUTE = "/api/user/userquests";

const questQueryAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                // let wallet = utils.getAddress(whiteListUser.wallet);
                const whiteListUser = req.whiteListUser;

                const { questId, page } = req.query;
                console.log(`** Get all user quests of id **`);

                let allUserQuestsOfThisId = await prisma.userQuest.findMany({
                    where: {
                        questId,
                    },
                });

                let userQuests = await prisma.userQuest.findMany({
                    where: {
                        questId,
                    },
                    skip: page * 5,
                    take: 5,
                    orderBy: [
                        {
                            updatedAt: "asc",
                        },
                    ],
                    include: {
                        user: true,
                    },
                });

                /* filter userQuests with messageId*/

                return res.status(200).json({
                    isError: false,
                    data: userQuests,
                    count: allUserQuestsOfThisId.length,
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
