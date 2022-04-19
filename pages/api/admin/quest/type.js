import { prisma } from "context/PrismaContext";
import { getSession } from "next-auth/react";

/* non protected route*/
export default async function questTypesQuery(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                let types = await prisma.questType.findMany();
                res.status(200).json(types);
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
