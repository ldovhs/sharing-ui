import { prisma } from "context/PrismaContext";
import adminMiddleware from "middlewares/adminMiddleware";


const AdminConfigsQueryAPI = async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        let allConfigs = await prisma.questVariables.findMany();

        return res.status(200).json(allConfigs);
      } catch (err) {
        console.log(err);
        res.status(500).json({ err });
      }
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
export default adminMiddleware(AdminConfigsQueryAPI);
