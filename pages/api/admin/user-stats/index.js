import { prisma } from "@context/PrismaContext";
import { adminMiddleware, withExceptionFilter } from "middlewares/";
import { ApiError } from 'next/dist/server/api-utils';


const adminUserStatsAPI = async (req, res) => {
    const { method } = req;

    if (method === "POST") {
        const { wallet } = req.body;
        let userCondition = {};

        if (wallet !== "") {
            userCondition.wallet = { contains: wallet.trim() };
        }

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

        return res.status(200).json(JSON.stringify(searchRes));
    }
    throw new ApiError(400, `Method ${req.method} Not Allowed`)
};

export default withExceptionFilter(adminMiddleware(adminUserStatsAPI));