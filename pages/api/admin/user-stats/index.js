import { prisma } from "@context/PrismaContext";
import adminMiddleware from "middlewares/adminMiddleware";
import axios from "axios";

const ROUTE = "/api/admin/user-stats";

const adminUserStatsAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            const { wallet, contract } = req.body;

            let userCondition = {},
                rewardCondition = [];

            if (wallet !== "") {
                userCondition.wallet = { contains: wallet.trim() };
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
                        discordUserDiscriminator: true,
                        whiteListUserData: true
                    },
                });

                searchRes.map(res => {
                    if (res.whiteListUserData === null) {
                        res.whiteListUserData = {
                            data: {
                                followers_count: 0
                            }
                        };
                    }
                })

                res.status(200).json(JSON.stringify(searchRes));

            } catch (err) {
                console.log(err.message);
                res.status(500).json({ err: err.message });
            }
            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default adminMiddleware(adminUserStatsAPI);

