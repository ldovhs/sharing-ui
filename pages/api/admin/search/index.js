import { prisma } from "../../../../repositories/PrismaContext";

export default async function adminSearch(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                //let result = await getAllCrabs();

                let data = await prisma.whiteList.findMany({
                    include: {
                        rewards: true,
                    },
                });

                res.status(200).json(data);
            } catch (err) {
                console.log(err);
                res.status(500).json({ err });
            }
            break;
        case "POST":
            try {
                let data = await prisma.whiteList.findMany({
                    include: {
                        rewards: true,
                    },
                });
                res.status(200).json(data);
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
