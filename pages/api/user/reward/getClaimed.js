import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";
import { getClaimedRewardsOfUser } from "repositories/reward";

const ROUTE = "/api/user/reward/getClaimed";

const getClaimedRewardForUserAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                const whiteListUser = req.whiteListUser;
                const rewarded = await getClaimedRewardsOfUser(whiteListUser.wallet);
                res.status(200).json(rewarded);
            } catch (error) {
                console.log(err);
                res.status(500).json({ err });
            }
            break;
        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default whitelistUserMiddleware(getClaimedRewardForUserAPI);
