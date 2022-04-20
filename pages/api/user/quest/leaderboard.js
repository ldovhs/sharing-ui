import Enums from "enums";
import { getQuestById } from "repositories/quest";

export default async function getQuestLeaderBoard(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                const { questId } = req.query;

                let questData = await getQuestById(questId);

                if (!questData) {
                    return res.status(200).json({ isError: true, message: "Not a valid quest." });
                }

                if (questData.type !== Enums.ANOMURA_SUBMISSION_QUEST) {
                    return res.status(422).json({
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
            res.setHeader("Allow", ["GET", "PUT"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
