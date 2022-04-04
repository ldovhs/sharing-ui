import { prisma } from "context/PrismaContext";
import { getSession } from "next-auth/react";
import { utils } from "ethers";
import Enums from "enums";

/*  protected route*/
export default async function QuestQuery(req, res) {
    const { method } = req;
    const session = await getSession({ req });

    switch (method) {
        case "GET":
            if (!session || !session.user.isAdmin) {
                return res.status(200).json({
                    message: "Not authenticated to do quests",
                    isError: true,
                });
            }
            try {
                let allQuests = await prisma.quest.findMany();

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
