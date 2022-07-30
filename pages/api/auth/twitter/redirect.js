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
                    let error = "Attempt to access without authenticated.";
                    return res.status(200).redirect(`/challenger/quest-redirect?error=${error}`);
                }

                const { code } = req.query;
                if (!code) {
                    let error = "Missing auth code. Please contact the administrator.";
                    return res.status(200).redirect(`/challenger/quest-redirect?error=${error}`);
                }

                const formData = new url.URLSearchParams({
                    client_id: NEXT_PUBLIC_TWITTER_CLIENT_ID,
                    client_secret: TWITTER_CLIENT_SECRET,
                    grant_type: "authorization_code",
                    code: code.toString(),
                    redirect_uri: `${NEXT_PUBLIC_WEBSITE_HOST}/challenger/api/auth/twitter/redirect`,
                    code_verifier: "challenge",
                });

                const response = await axios.post(TOKEN_TWITTER_AUTH_URL, formData.toString(), {
                    headers: {
                        "Content-type": `application/x-www-form-urlencoded`,
                    },
                });

                if (!response || !response?.data?.access_token) {
                    let error = "Couldn't authenticate with Twitter Auth Oath2.";
                    return res.status(200).redirect(`/challenger/quest-redirect?error=${error}`);
                }

                const userInfo = await axios.get(USERINFO_TWITTER_URL, {
                    headers: {
                        Authorization: `Bearer ${response.data.access_token}`,
                    },
                });

                if (!userInfo) {
                    let error = "Couldn't retrieve twitter info, pls retry later!";
                    return res.status(200).redirect(`/challenger/quest-redirect?error=${error}`);
                }

                if (
                    whiteListUser.twitterId != null &&
                    (whiteListUser.twitterId.length > 0 || whiteListUser.twitterUserName.length > 0)
                ) {
                    let error = "Twitter account is already authenticated.";
                    return res.status(200).redirect(`/challenger/quest-redirect?error=${error}`);
                }

                // find user of this twitter handle
                let existingTwitterUser = await prisma.whiteList.findFirst({
                    where: {
                        twitterUserName: userInfo?.data?.data?.username,
                    },
                });
                if (existingTwitterUser) {
                    let error = "Same twitter user authenticated";
                    return res.status(200).redirect(`/challenger/quest-redirect?error=${error}`);
                }

                let twitterAuthQuestType = await getQuestType(Enums.TWITTER_AUTH);
                if (!twitterAuthQuestType) {
                    let error =
                        "Cannot find quest type twitter auth. Pleaes contact administrator.";
                    return res.status(200).redirect(`/challenger/quest-redirect?error=${error}`);
                }

                let twitterQuest = await getQuestByTypeId(twitterAuthQuestType.id);
                if (!twitterQuest) {
                    let error = "Cannot find any quest associated with twitter auth.";
                    return res.status(200).redirect(`/challenger/quest-redirect?error=${error}`);
                }

                let userQuest = await updateTwitterUserAndAddRewardTransaction(
                    twitterQuest,
                    whiteListUser.wallet,
                    userInfo.data.data
                );

                if (!userQuest) {
                    let error = "Cannot finish this quest, pls contact administrator!";
                    return res.status(200).redirect(`/challenger/quest-redirect?error=${error}`);
                }

                res.status(200).redirect(`/challenger/quest-redirect`);
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
