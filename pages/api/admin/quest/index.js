import { prisma } from "context/PrismaContext";
import { getSession } from "next-auth/react";
import { isAdmin } from "repositories/session-auth";

/* admin protected route */
export default async function QuestQuery(req, res) {
    const { method } = req;
    const session = await getSession({ req });

    switch (method) {
        case "GET":
            let adminCheck = await isAdmin(session);
            if (!adminCheck) {
                return res.status(200).json({
                    message: "Not authenticated for quest",
                    isError: true,
                });
            }
            try {
                let allQuests = await prisma.quest.findMany({
                    include: {
                        type: true,
                    },
                });

                return res.status(200).json(allQuests);
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
