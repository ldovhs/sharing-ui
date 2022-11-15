import { prisma } from "@context/PrismaContext";
import axios from "axios";
import url from "url";
import { getSession } from "next-auth/react";
import { utils } from "ethers";
import Enums from "enums";
import { isWhiteListUser } from "repositories/session-auth";
import { getQuestType, getQuestByTypeId } from "repositories/quest";
import { updateDiscordUserAndAddRewardTransaction } from "repositories/transactions";

const TOKEN_DISCORD_AUTH_URL = "https://discord.com/api/oauth2/token";
const USERINFO_DISCORD_AUTH_URL = "https://discord.com/api/users/@me";

const { NEXT_PUBLIC_WEBSITE_HOST, NEXT_PUBLIC_DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } =
    process.env;

// @dev this is used for discord auth quest only
export default async function discordRedirect(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                const session = await getSession({ req });

                let whiteListUser = await isWhiteListUser(session);

                // if (!session || !whiteListUser) {
                //     let error = "Attempt to access without authenticated.";
                //     return res.status(200).redirect(`/challenger/quest-redirect?error=${error}`);
                // }

                const { code } = req.query;
                if (!code) {
                    let error = "Missing auth code. Please contact the administrator.";
                    return res.status(200).redirect(`/challenger/quest-redirect?error=${error}`);
                }

                const formData = new url.URLSearchParams({
                    client_id: NEXT_PUBLIC_DISCORD_CLIENT_ID,
                    client_secret: DISCORD_CLIENT_SECRET,
                    grant_type: "authorization_code",
                    code: code.toString(),
                    redirect_uri: `${NEXT_PUBLIC_WEBSITE_HOST}/challenger/api/auth/discord/redirect`,
                });

                const response = await axios.post(TOKEN_DISCORD_AUTH_URL, formData.toString(), {
                    headers: {
                        "Content-type": `application/x-www-form-urlencoded`,
                    },
                });

                if (!response || !response?.data?.access_token) {
                    let error = "Couldn't authenticate with Discord. Please contact administrator.";
                    return res.status(200).redirect(`/challenger/quest-redirect?error=${error}`);
                }

                const userInfo = await axios.get(USERINFO_DISCORD_AUTH_URL, {
                    headers: {
                        Authorization: `Bearer ${response.data.access_token}`,
                    },
                });

                if (!userInfo) {
                    let error =
                        "Could not retrieve discord user information. Please contact administrator.";
                    return res.status(200).redirect(`/challenger/quest-redirect?error=${error}`);
                }

                // checked if existed
                let existingDiscordUser = await prisma.whiteList.findFirst({
                    where: {
                        discordId: userInfo.data.id,
                    },
                });
                if (existingDiscordUser) {
                    let error = "Same discord user authenticated";
                    return res.status(200).redirect(`/challenger/quest-redirect?error=${error}`);
                }

                // check if finished
                let discordAuthQuestType = await getQuestType(Enums.DISCORD_AUTH);
                if (!discordAuthQuestType) {
                    let error = "Cannot find quest type discord auth";
                    return res.status(200).redirect(`/challenger/quest-redirect?error=${error}`);
                }

                let discordQuest = await getQuestByTypeId(discordAuthQuestType.id);
                if (!discordQuest) {
                    let error = "Cannot find quest associated with discord auth";
                    return res.status(200).redirect(`/challenger/quest-redirect?error=${error}`);
                }

                const questId = discordQuest.questId;
                if (whiteListUser) {
                    let discordQuestOfThisUser = await prisma.userQuest.findFirst({
                        where: {

                            userId: whiteListUser?.userId,
                            questId: questId,
                        },
                    });

                    if (discordQuestOfThisUser) {
                        let error = "Discord quest has finished.";
                        return res.status(200).redirect(`/challenger/quest-redirect?error=${error}`);
                    }

                }

                await updateDiscordUserAndAddRewardTransaction(
                    discordQuest,
                    whiteListUser,
                    userInfo.data
                );

                let discordSignUp = `Sign Up With Discord Successfully`
                res.status(200).redirect(`/challenger/quest-redirect?result=${discordSignUp}`);
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
