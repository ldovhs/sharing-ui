import { getSession } from "next-auth/react";
import { utils } from "ethers";
import { isWhiteListUser } from "repositories/session-auth";
import { getAllEnableQuestsForUser, getQuestsDoneByThisUser } from "repositories/quest";

/* user protected route*/
export default async function QuestQuery(req, res) {
    const { method } = req;
    const session = await getSession({ req });

    switch (method) {
        case "GET":
            let whiteListUser = await isWhiteListUser(session);
            if (!whiteListUser) {
                return res.status(200).json({
                    message: "Non-user authenticated",
                    isError: true,
                });
            }

            try {
                let wallet = utils.getAddress(whiteListUser.wallet);

                console.log(`** Get all enabled quests for user **`);
                let availableQuests = await getAllEnableQuestsForUser();

                console.log(`** Get quests done by this user **`);
                let finishedQuest = await getQuestsDoneByThisUser(wallet);

                await Promise.all(
                    availableQuests.map((aq) => {
                        let relatedQuest = finishedQuest.find((q) => q.questId === aq.questId);
                        if (relatedQuest) {
                            aq.isDone = true;
                            aq.quantity = relatedQuest.rewardedQty;
                        } else {
                            aq.isDone = false;
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
            res.setHeader("Allow", ["GET", "PUT"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
