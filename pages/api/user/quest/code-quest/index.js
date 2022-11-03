import { getAllEnableQuestsForUser, getQuestsDoneByThisUser } from "repositories/quest";
import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";
import Enums from "enums";

const codeQuestQueryAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                const { event } = req.query;
                const whiteListUser = req.whiteListUser;
                console.log(`** Get all enabled quests for user **`);
                let availableQuests = await getAllEnableQuestsForUser();

                console.log(`** Get quests done by this user **`);
                let finishedQuest = await getQuestsDoneByThisUser(whiteListUser.userId);

                let quests = availableQuests.filter(q => {
                    if (q.type.name === Enums.CODE_QUEST && q.extendedQuestData.codeEvent === event) {
                        return true;
                    }
                    if (
                        q.extendedQuestData.collaboration &&
                        q.extendedQuestData.collaboration.length > 0 &&
                        q.extendedQuestData.collaboration === collaboration
                    ) {
                        return false;
                    }
                    if (
                        q.extendedQuestData.collaboration &&
                        q.extendedQuestData.collaboration.length > 0 &&
                        q.extendedQuestData.collaboration !== collaboration
                    ) {
                        return false;
                    }

                    /* exclude daily free cell */
                    if (
                        q.type.name === Enums.ZED_CLAIM ||
                        q.type.name === Enums.NOODS_CLAIM ||
                        q.type.name === Enums.DAILY_SHELL
                    ) {
                        return false;
                    }

                    return false;
                }).map((aq) => {
                    let relatedQuest = finishedQuest.find((q) => q.questId === aq.questId);
                    if (relatedQuest) {

                        if (//Enums.DAILY_SHELL
                            relatedQuest?.quest.type.name === Enums.DAILY_SHELL &&
                            relatedQuest?.extendedUserQuestData?.frequently === Enums.DAILY
                        ) {
                            let oldDate = relatedQuest?.extendedUserQuestData?.date;
                            let [today] = new Date().toISOString().split("T");
                            if (today > oldDate) {
                                aq.isDone = false;
                            } else aq.isDone = true;
                        }

                        else {// THE REST
                            aq.isDone = true;
                            aq.rewardedQty = relatedQuest.rewardedQty;
                        }
                    } else {
                        aq.isDone = false;
                        aq.rewardedQty = 0;
                    }
                    return aq
                })

                return res.status(200).json(quests);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
            break;

        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};
export default whitelistUserMiddleware(codeQuestQueryAPI);
