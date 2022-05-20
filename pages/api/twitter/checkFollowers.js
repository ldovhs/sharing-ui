import { prisma } from "@context/PrismaContext";
import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";
import axios from "axios";
import Enums from "enums";
import { UpdateClaimAndPendingRewardTransaction } from "repositories/transactions";

const { DISCORD_NODEJS, NEXT_PUBLIC_WEBSITE_HOST, NODEJS_SECRET } = process.env;

const ROUTE = "/api/twitter/checkFollowers";
// should not use as Twitter has cap limit of 15 request per 15 mins per user
const checkTwitterFollowerAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            try {
                const twitterId = req.twitterId;
                let isFollower = false,
                    followers;
                let cursor = -1;
                do {
                    followers = await axios.get(
                        `https://api.twitter.com/1.1/followers/ids.json?cursor=${cursor}&screen_name=colormonsterNFT&count=5000`,

                        {
                            headers: {
                                Authorization: `Bearer ${process.env.NEXT_PUBLIC_TWITTER_BEARER}`,
                                // "Content-Type": "application/json",
                            },
                        }
                    );

                    // console.log(followers);
                    if (followers?.data.ids.includes(twitterId)) {
                        isFollower = true;
                        break;
                    }
                    console.log(followers);

                    cursor = followers?.data?.next_cursor;
                    console.log(1);
                } while (followers.next_cursor != 0);

                res.status(200).json({ isFollower });
            } catch (err) {
                //  console.log(err);
                res.status(500).json({ err: err.message });
            }
            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default whitelistUserMiddleware(checkTwitterFollowerAPI);
