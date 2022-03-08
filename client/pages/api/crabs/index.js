import { getAllCrabs } from "../../../repositories/crabs";

export default async function crabsQuery(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                let allCrabs = await getAllCrabs();
                res.status(200).json(allCrabs);
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
