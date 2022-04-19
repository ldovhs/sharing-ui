import { prisma } from "@context/PrismaContext";
import { getSession } from "next-auth/react";
import { utils } from "ethers";

export default async function whitelistAPI(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                const { address } = req.query;
                let wallet = utils.getAddress(address);
                const user = await prisma.whiteList.findUnique({
                    where: {
                        wallet,
                    },
                });

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
                const { discordId, discordUserDiscriminator, wallet, twitterId, twitterUserName } =
                    req.body;

                let updateCondition = {};

                if (discordId.trim().length > 0) {
                    updateCondition = { ...updateCondition, discordId };
                }
                if (discordUserDiscriminator.trim().length > 0) {
                    updateCondition = { ...updateCondition, discordUserDiscriminator };
                }
                if (twitterId.trim().length > 0) {
                    updateCondition = { ...updateCondition, twitterId };
                }
                if (twitterUserName.trim().length > 0) {
                    updateCondition = { ...updateCondition, twitterUserName };
                }

                const user = await prisma.whiteList.upsert({
                    where: { wallet },
                    update: updateCondition,
                    create: {
                        wallet,
                        discordId,
                        discordUserDiscriminator,
                        twitterId,
                        twitterUserName,
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
