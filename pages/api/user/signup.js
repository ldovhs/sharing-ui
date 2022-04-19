import { prisma } from "@context/PrismaContext";
import { getSession } from "next-auth/react";
import { utils } from "ethers";

export default async function whitelistSignUp(req, res) {
    const { method } = req;

    switch (method) {
        case "POST":
            try {
                console.log(`**Sign up new user**`);
                const { address, signature } = req.body;
                if (!signature) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "Missing user signature on sign up." });
                }

                let wallet = utils.getAddress(address);

                const newUser = await prisma.whiteList.create({
                    data: {
                        wallet,
                        discordId: null,
                        discordUserDiscriminator: null,
                        twitterId: null,
                        twitterUserName: null,
                    },
                });

                if (!newUser) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "Cannot sign up new user." });
                }

                return res.status(200).json(newUser);
            } catch (error) {
                console.log(error);
                return res.status(200).json({ isError: true, message: error.message });
            }

            break;
        default:
            res.setHeader("Allow", ["GET", "PUT"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
