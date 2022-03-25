import { getAllRewardTypes } from "repositories/admin";
import { prisma } from "../../../../context/PrismaContext";

/* non protected route*/
export default async function adminSearch(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                let types = await getAllRewardTypes();
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
