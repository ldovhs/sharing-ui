import { prisma } from "context/PrismaContext";
import { getSession } from "next-auth/react";
import { utils } from "ethers";
import Enums from "enums";
import { isWhitelistUser } from "repositories/session-auth";
import { getAllEnableQuestsForUser, getQuestsDoneByThisUser } from "repositories/quest";
import { getWhitelistByWallet } from "repositories/whitelist";

/* user protected route*/
export default async function QuestQuery(req, res) {
    const { method } = req;
    const session = await getSession({ req });

    switch (method) {
        case "GET":
            let userWallet = await isWhitelistUser(session);
            if (!userWallet) {
                return res.status(422).json({
                    message: "Non-user authenticated",
                    isError: true,
                });
            }

            try {
                console.log(`** If current session has a valid address in db **`);

                let wallet = utils.getAddress(userWallet);
                let findUserBySession = await getWhitelistByWallet(wallet);

                if (!findUserBySession) {
                    return res.status(200).json({
                        message: "Not authenticated session or trying to do quest of someone else",
                        isError: true,
                    });
                }
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
                            aq.user = relatedQuest.user;
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
