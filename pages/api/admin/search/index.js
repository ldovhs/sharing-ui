import { prisma } from "@context/PrismaContext";
import adminMiddleware from "middlewares/adminMiddleware";
const ROUTE = "/api/admin/search";

const adminSearchAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            const { wallet, userId, twitter, discord, rewards } = req.body;

            let userCondition = {},
                rewardCondition = [];

            if (wallet !== "") {
                userCondition.wallet = { contains: wallet.trim() };
            }
            if (userId !== "") {
                userCondition.userId = { contains: userId.trim() };
            }
            if (twitter !== "") {
                userCondition.twitterId = { contains: twitter.trim() };
            }
            if (discord !== "") {
                userCondition.discordId = { contains: discord.trim() };
            }
            if (rewards.length > 0) {
                rewards.forEach((reward) => {
                    rewardCondition.push({
                        rewardTypeId: reward.typeId,
                        AND: [
                            {
                                quantity: {
                                    gte: parseInt(reward.minQty),
                                    lte: parseInt(reward.maxQty),
                                },
                            },
                        ],
                    });
                });
            }

            try {
                let searchRes = await prisma.whiteList.findMany({
                    where: userCondition,
                    select: {
                        id: true,
                        userId: true,
                        wallet: true,
                        twitterId: true,
                        twitterUserName: true,
                        discordId: true,
                        discordUserDiscriminator: true,
                        rewards: {
                            where: rewardCondition.length === 0 ? {} : { OR: rewardCondition },
                            select: {
                                quantity: true,
                                rewardType: true,
                            },
                        },
                    },
                });

                if (rewardCondition.length > 0) {
                    const result = searchRes.filter((r) => r.rewards.length > 0);
                    return res.status(200).json(result);
                } else {
                    res.status(200).json(searchRes);
                }
            } catch (err) {
                console.log(err);
                res.status(500).json({ err });
            }
            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default adminMiddleware(adminSearchAPI);
