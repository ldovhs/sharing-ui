import { getAllEnableQuestsForUser, getQuestsDoneByThisUser } from "repositories/quest";
import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";
import Enums from "enums";


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
                            //Enums.DAILY_SHELL
                            if (
                                relatedQuest?.quest.type.name === Enums.DAILY_SHELL &&
                                relatedQuest?.extendedUserQuestData?.frequently === Enums.DAILY
                            ) {
                                let oldDate = relatedQuest?.extendedUserQuestData?.date;
                                let [today] = new Date().toISOString().split("T");
                                if (today > oldDate) {
                                    aq.isDone = false;
                                } else aq.isDone = true;
                            }

                            // THE REST
                            else {
                                aq.isDone = true;
                                aq.rewardedQty = relatedQuest.rewardedQty;
                            }
                        } else {
                            aq.isDone = false;
                            aq.rewardedQty = 0;
                        }
                    })
                );

                return res.status(200).json(availableQuests);
            } catch (err) {
                // console.log(err);
                res.status(500).json({ err });
            }
            break;

        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};
export default whitelistUserMiddleware(questQueryAPI);
