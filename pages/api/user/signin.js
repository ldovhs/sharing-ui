import { prisma } from "@context/PrismaContext";
import { getSession } from "next-auth/react";
import { utils } from "ethers";

export default async function whitelistSignUp(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                const { address } = req.query;
                let wallet = utils.getAddress(address);
                let user = await prisma.whiteList.findUnique({
                    where: {
                        wallet,
                    },
                });

                if (!user) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "Cannot find this user in our record" });
                }

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
