import { getAllEnableQuestsForUser, getQuestsDoneByThisUser } from "repositories/quest";
import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";

const ROUTE = "/api/user/quest";

const questQueryAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                // let wallet = utils.getAddress(whiteListUser.wallet);
                const whiteListUser = req.whiteListUser;
                console.log(`** Get all enabled quests for user **`);
                let availableQuests = await getAllEnableQuestsForUser();

                console.log(`** Get quests done by this user **`);
                let finishedQuest = await getQuestsDoneByThisUser(whiteListUser.wallet);

                await Promise.all(
                    availableQuests.map((aq) => {
                        let relatedQuest = finishedQuest.find((q) => q.questId === aq.questId);
                        if (relatedQuest) {
                            aq.isDone = true;
                            aq.rewardedQty = relatedQuest.rewardedQty;
                        } else {
                            aq.isDone = false;
                            aq.rewardedQty = 0;
                        }
                    })
                );

                return res.status(200).json(availableQuests);
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
