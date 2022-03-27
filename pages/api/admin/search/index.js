import { prisma } from "@context/PrismaContext";

export default async function adminSearch(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                throw new Error("Not implemented");
            } catch (err) {
                console.log(err);
                res.status(500).json({ err });
            }
            break;
        case "POST":
            console.log(req.body);
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
                userCondition.twitter = { contains: twitter.trim() };
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
                                tokens: {
                                    gte: parseInt(reward.minTokens),
                                    lte: parseInt(reward.maxTokens),
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
                        twitter: true,
                        discordId: true,
                        rewards: {
                            where: rewardCondition.length === 0 ? {} : { OR: rewardCondition },
                            select: {
                                tokens: true,
                                rewardType: true,
                            },
                        },
                    },
                });

                const result = searchRes.filter((r) => r.rewards.length > 0);
                res.status(200).json(result);
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
