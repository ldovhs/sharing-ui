import { prisma } from "context/PrismaContext";
import { getSession } from "next-auth/react";
import { utils } from "ethers";
import Enums from "enums";

/* non protected route*/
export default async function QuestQuery(req, res) {
    const { method } = req;
    const session = await getSession({ req });

    switch (method) {
        case "GET":
            if (!session || !session.user) {
                return res.status(200).json({
                    message: "Not authenticated to do quests",
                    isError: true,
                });
            }
            try {
                let { username } = req.query;

                console.log(`** If current session is a valid address in db **`);
                if (
                    username.toLowerCase() !== session.user.address.toLowerCase() ||
                    !utils.isAddress(username)
                ) {
                    return res.status(200).json({
                        message: "You are doing someone else'quest, King Octopus will haunt you",
                        isError: true,
                    });
                }

                console.log(session.user.address);
                let sessionWallet = utils.getAddress(session.user.address);
                let findUserBySession = await prisma.whiteList.findFirst({
                    where: {
                        wallet: sessionWallet,
                    },
                });
                let findUserByWallet = await prisma.whiteList.findFirst({
                    where: {
                        wallet: username,
                    },
                });
                if (!findUserBySession || !findUserByWallet) {
                    return res.status(200).json({
                        message: "Not authenticated session or trying to do quest of someone else",
                        isError: true,
                    });
                }
                console.log(`** Get all quests **`);
                let availableQuests = await prisma.quest.findMany({
                    where: {
                        isEnabled: true,
                    },
                    include: {
                        rewardType: true,
                    },
                });
                console.log(availableQuests);

                console.log(`** Get quests done by this user **`);
                let finishedQuest = await prisma.userQuest.findMany({
                    where: {
                        wallet: sessionWallet,
                    },
                });
                console.log(finishedQuest);

                availableQuests.forEach((aq) => {
                    if (finishedQuest.some((q) => q.questId == aq.questId)) {
                        console.log("Found quest done");
                        aq.isDone = true;
                    } else {
                        aq.isDone = false;
                    }
                });

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
