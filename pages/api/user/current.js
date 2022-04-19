import { prisma } from "@context/PrismaContext";
import { getSession } from "next-auth/react";
import { utils } from "ethers";
import { isWhitelistUser } from "repositories/session-auth";

export default async function whitelistAPI(req, res) {
    const { method } = req;
    const session = await getSession({ req });
    switch (method) {
        case "GET":
            try {
                if (!session) {
                    return res.status(400).json({
                        message: "Not authenticated to get user info",
                        isError: true,
                    });
                }
                let userWallet = await isWhitelistUser(session);
                if (!userWallet) {
                    return res.status(422).json({
                        message: "Non-user authenticated",
                        isError: true,
                    });
                }
                let user = await prisma.WhiteList.findUnique({
                    where: { wallet: userWallet },
                });

                res.status(200).json(user);
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
