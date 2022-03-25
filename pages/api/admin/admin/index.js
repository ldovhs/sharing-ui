import { prisma } from "@context/PrismaContext";

export default async function adminAPI(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                const { address } = req.query;
                console.log(address);
                const admin = await prisma.Admin.findFirst({
                    where: {
                        wallet: { equals: address, mode: "insensitive" },
                    },
                });
                console.log(admin);
                res.status(200).json(admin);
            } catch (err) {
                console.log(err);
                res.status(500).json({ err });
            }
            break;
        case "POST":
            throw new Error("Not implemented");
            break;
        default:
            res.setHeader("Allow", ["GET", "PUT"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
