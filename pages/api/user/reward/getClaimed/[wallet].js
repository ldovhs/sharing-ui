import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";
import { getClaimedRewardsOfUser } from "repositories/reward";

const getClaimedRewardForUserAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                const { wallet } = req.query;
                // const whiteListUser = req.whiteListUser;
                // console.log(wallet)
                // const rewarded = await getClaimedRewardsOfUser(whiteListUser.wallet);
                const rewarded = await getClaimedRewardsOfUser(wallet);
                console.log("getClaimed is hit")


                res.setHeader('Cache-Control', 'max-age=0, s-maxage=5, stale-while-revalidate');
                res.status(200).json(rewarded);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            break;
        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default whitelistUserMiddleware(getClaimedRewardForUserAPI);
