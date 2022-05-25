import whitelistUserMiddleware from "@middlewares/whitelistUserMiddleware";
import { prisma } from "@context/PrismaContext";
import Enums from "enums";

const handler = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                const whiteListUser = req.whiteListUser;

                const { userquestId } = req.query;
                if (!userquestId) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "Missing userquestId query." });
                }
                console.log(req.whiteListUser);
                let userQuestData = await prisma.userQuest.findFirst({
                    where: {
                        questId: userquestId,
                        wallet: whiteListUser.wallet,
                    },
                });
                if (!userQuestData) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "Not a valid user quest." });
                }

                if (userQuestData && userQuestData.length > 0) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "Find more than 1 user quest per user." });
                }

                console.log(userQuestData);

                res.status(200).json(userQuestData);
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

export default whitelistUserMiddleware(handler);
