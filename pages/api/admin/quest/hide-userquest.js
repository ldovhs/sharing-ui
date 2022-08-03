import { prisma } from "@context/PrismaContext";
import adminMiddleware from "middlewares/adminMiddleware";
import axios from "axios";

const { NEXT_PUBLIC_WEBSITE_HOST, NODEJS_SECRET, DISCORD_NODEJS } = process.env;

const hideUserQuestAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            try {
                const { questId, extendedUserQuestData, user } = req.body;
                const { discordChannel, imageUrl } = extendedUserQuestData;

                let entry = await prisma.UserQuest.findUnique({
                    where: {
                        wallet_questId: { wallet: user.wallet, questId },
                    },
                });
                if (!entry) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "Cannot find this user quest!" });
                }

                await prisma.UserQuest.update({
                    where: {
                        wallet_questId: { wallet: user.wallet, questId },
                    },
                    data: {
                        isHidden: true,
                    },
                })

                return res.status(200).json({ message: "ok!" });
            } catch (error) {
                console.log(error);
                return res.status(200).json({ isError: true, message: error.message });
            }
            break;
        default:
            res.setHeader("Allow", ["GET", "PUT"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default adminMiddleware(hideUserQuestAPI);

