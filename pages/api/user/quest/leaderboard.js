import Enums from "enums";
import { getQuestById } from "repositories/quest";

const ROUTE = "/api/user/quest/leaderboard";

export default async function getQuestLeaderBoardAPI(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                const { questId } = req.query;
                if (!questId) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "Missing questId query." });
                }

                let questData = await getQuestById(questId);
                if (!questData) {
                    return res.status(200).json({ isError: true, message: "Not a valid quest." });
                }
                console.log(questData);
                if (questData.type.name !== Enums.IMAGE_UPLOAD_QUEST) {
                    return res.status(200).json({
                        isError: true,
                        message: `No data for this type of quest ${questData.type}`,
                    });
                }

                res.status(200).json(questData);
            } catch (err) {
                console.log(err);
                res.status(500).json({ err });
            }
            break;
        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
