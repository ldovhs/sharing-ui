import { prisma } from "@context/PrismaContext";
import { getSession } from "next-auth/react";

export default async function whitelistAPI(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                const { address } = req.query;
                console.log(address);

                const user = await prisma.whiteList.findFirst({
                    where: {
                        wallet: { equals: address, mode: "insensitive" },
                    },
                });

                if (!user) {
                    res.status(200).json({
                        message: "Login user is not authenticatd to claim this reward",
                        isError: true,
                    });
                    return;
                }

                res.status(200).json(user);
            } catch (err) {
                console.log(err);
                res.status(500).json({ err });
            }
            break;
        case "POST":
            const session = await getSession({ req });
            if (!session || !session.user?.isAdmin) {
                return res.status(400).json({
                    message: "Not authenticated to add new user",
                    isError: true,
                });
            }

            try {
                console.log(`*****Add New User`);
                const { discord, wallet, twitter } = req.body;

                let updateCondition = {};

                if (discord.trim().length > 0) {
                    updateCondition = { ...updateCondition, discordId: discord };
                }
                if (twitter.trim().length > 0) {
                    updateCondition = { ...updateCondition, twitter };
                }

                const user = await prisma.whiteList.upsert({
                    where: { wallet },
                    update: updateCondition,
                    create: {
                        wallet,
                        discordId: discord,
                        twitter,
                        numberOfInvites: 0,
                    },
                });

                return res.status(200).json(user);
            } catch (error) {
                return res.status(200).json({ isError: true, message: error.message });
            }

            break;
        default:
            res.setHeader("Allow", ["GET", "PUT"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
