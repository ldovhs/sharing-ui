import { prisma } from "@context/PrismaContext";

export default async function whitelistAPI(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                const { address } = req.query;
                console.log(address);

                const user = await prisma.whiteList.findFirst({
                    where: {
                        wallet: { equals: address, mode: "insensitive" },
                    },
                });

                if (!user) {
                    res.status(200).json({
                        message: "Login user is not authenticatd to claim this reward",
                        isError: true,
                    });
                    return;
                }

                res.status(200).json(user);
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
