import axios from "axios";
import url from "url";
import { getSession } from "next-auth/react";
import { utils } from "ethers";
import Enums from "enums";
import { isWhiteListUser } from "repositories/session-auth";
import { getQuestType, getQuestByTypeId } from "repositories/quest";
import { updateTwitterUserAndAddRewardTransaction } from "repositories/transactions";

const TOKEN_TWITTER_AUTH_URL = "https://api.twitter.com/2/oauth2/token";
const USERINFO_TWITTER_URL = "https://api.twitter.com/2/users/me";

const { NEXT_PUBLIC_WEBSITE_HOST, NEXT_PUBLIC_TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET } =
    process.env;

const ROUTE = "/api/auth/twitter/redirect";
// @dev this is used for twitter auth quest only
export default async function twitterRedirect(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                const session = await getSession({ req });
                let whiteListUser = await isWhiteListUser(session);

                if (!session || !utils.isAddress(whiteListUser.wallet)) {
                    throw new Error("Unauthenticated user");
                }

                const { code } = req.query;
                if (!code) {
                    res.status(200).json({ message: "Missing auth code." });
                }

                const formData = new url.URLSearchParams({
                    client_id: NEXT_PUBLIC_TWITTER_CLIENT_ID,
                    client_secret: TWITTER_CLIENT_SECRET,
                    grant_type: "authorization_code",
                    code: code.toString(),
                    redirect_uri: `${NEXT_PUBLIC_WEBSITE_HOST}/api/auth/twitter/redirect`,
                    code_verifier: "challenge",
                });

                const response = await axios.post(TOKEN_TWITTER_AUTH_URL, formData.toString(), {
                    headers: {
                        "Content-type": `application/x-www-form-urlencoded`,
                    },
                });

                if (!response || !response?.data?.access_token) {
                    throw new Error("Couldn't authenticate with Twitter Auth Oath2");
                }

                const userInfo = await axios.get(USERINFO_TWITTER_URL, {
                    headers: {
                        Authorization: `Bearer ${response.data.access_token}`,
                    },
                });

                if (!userInfo) {
                    throw new Error("Couldn't retrieve twitter info, pls retry later!");
                }

                if (
                    whiteListUser.twitterId != null &&
                    (whiteListUser.twitterId.length > 0 || whiteListUser.twitterUserName.length > 0)
                ) {
                    return res
                        .status(200)
                        .json({ message: "This twitter account is already authenticated before." });
                }

                let twitterAuthQuestType = await getQuestType(Enums.TWITTER_AUTH);
                if (!twitterAuthQuestType) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "Cannot find quest type twitter auth" });
                }

                let twitterQuest = await getQuestByTypeId(twitterAuthQuestType.id);
                if (!twitterQuest) {
                    return res
                        .status(200)
                        .json({
                            isError: true,
                            message: "Cannot find quest associated with twitter auth",
                        });
                }

                let userQuest = await updateTwitterUserAndAddRewardTransaction(
                    twitterQuest,
                    whiteListUser.wallet,
                    userInfo.data.data
                );

                if (!userQuest) {
                    return res
                        .status(200)
                        .json({ message: "Cannot finish this quest, pls contact administrator!" });
                }

                res.status(200).json({
                    message: "Twitter Auth Quest completed, please close this page!",
                });
            } catch (err) {
                console.log(err);
                res.status(200).json({ error: err.message });
            }
            break;
        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
