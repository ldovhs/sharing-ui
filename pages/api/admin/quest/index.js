import { prisma } from "context/PrismaContext";
import { getSession } from "next-auth/react";
import Enums from "enums";

/* non protected route*/
export default async function QuestQuery(req, res) {
    const { method } = req;
    const session = await getSession({ req });

    switch (method) {
        case "GET":
            // TODO
            // if (!session || !session.user) {
            //     return res.status(400).json({
            //         message: "Not authenticated to get quests",
            //         isError: true,
            //     });
            // }
            try {
                console.log(132323);
                let quests = await prisma.quest.findMany();
                return res.status(200).json(quests);
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
