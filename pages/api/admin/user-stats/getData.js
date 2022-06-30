import { prisma } from "@context/PrismaContext";
import adminMiddleware from "middlewares/adminMiddleware";

const ROUTE = "/api/admin/user-stats/getData";

const adminGetUserStatDataAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "GET":
            const { contractAddress } = req.query

            try {
                let data = await prisma.moralisNftData.findUnique({
                    where: {
                        contractAddress
                    }
                })
                return res.status(200).json(data);

            } catch (err) {
                console.log(err.message)
                res.status(500).json({ err: err.message });
            }
            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default adminMiddleware(adminGetUserStatDataAPI);
