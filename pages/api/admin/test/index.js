import { prisma } from "@context/PrismaContext";
import { getSession } from "next-auth/react";

export default async function TestAPI(req, res) {
    const { method } = req;
    const session = await getSession({ req });
    if (!session) {
        res.status(400).json({ message: "Not authenticated", isError: true });
    }
    switch (method) {
        case "GET":
            try {
                let pendingReward = await prisma.pendingReward.findMany({});

                res.status(200).json({ pendingReward, isError: false });
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
