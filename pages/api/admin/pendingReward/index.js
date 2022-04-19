import { prisma } from "@context/PrismaContext";
import { getSession } from "next-auth/react";
import Enums from "enums";
import axios from "axios";
import { isAdmin } from "repositories/session-auth";
import { createPendingReward, searchPendingRewardBasedOnGeneratedURL } from "repositories/reward";
import { isWhitelistUser } from "repositories/session-auth";

const { DISCORD_NODEJS, DISCORD_REWARD_CHANNEL, NEXT_PUBLIC_WEBSITE_HOST, DISCORD_BOT_TOKEN } =
    process.env;

export default async function PendingRewardAPI(req, res) {
    const { method } = req;
    const session = await getSession({ req });

    switch (method) {
        /* Get pending reward from db*/
        case "GET":
            try {
                const { username, generatedURL } = req.query;
                if (!username) return res.status(200).json({ message: "Await" });

                let walletSession = await isWhitelistUser(session);

                console.log(`***** Finding user wallet for pending reward, username: ${username}`);
                let user = await prisma.whiteList.findFirst({
                    where: {
                        OR: [
                            {
                                discordId: username,
                            },
                            {
                                twitterId: username,
                            },
                            {
                                wallet: username,
                            },
                            {
                                discordUserDiscriminator: username,
                            },
                        ],
                    },
                });

                if (!user) {
                    return res.status(200).json({
                        message: `Cannot find any record for user ${username}`,
                        isError: true,
                    });
                }
                // console.log(user);
                /* search for pending reward from the wallet info */
                let pendingReward = await searchPendingRewardBasedOnGeneratedURL(
                    generatedURL,
                    user.wallet
                );

                if (pendingReward.wallet !== walletSession) {
                    return res.status(200).json({
                        message: `User ${walletSession} does not own this reward ${generatedURL}`,
                        isError: true,
                    });
                }

                res.status(200).json({ pendingReward, isError: false });
            } catch (err) {
                console.log(err);
                res.status(500).json({ err });
            }
            break;

        /*  
            @dev Create a new pending reward
            0. Check if req is from an admin
            1. Look for user in database if exists
            2. Create a pending reward since we found the user
            3. Show in discord if ShowInDiscord is true
        */
        case "POST":
            let adminCheck = await isAdmin(session);
            if (!adminCheck) {
                return res.status(422).json({
                    message: "Not authenticated for reward route",
                    isError: true,
                });
            }

            try {
                const { username, type, wallet, rewardTypeId, quantity, showInDiscord } = req.body;

                let userCondition = { wallet };

                if (type === Enums.DISCORD && username.trim().length > 0) {
                    userCondition = { ...userCondition, discordId: username };
                }
                if (type === Enums.TWITTER && username.trim().length > 0) {
                    userCondition = { ...userCondition, twitterId: username };
                }
                if (username.trim().length === 0) {
                    userCondition = { ...userCondition, wallet };
                }

                console.log(`** Pending Reward: Finding user wallet: ${wallet} **`);
                let user = await prisma.whiteList.findFirst({
                    where: userCondition,
                });

                if (!user) {
                    res.status(200).json({
                        message: `Cannot find any user with ${
                            type === Enums.DISCORD ? "Discord Id" : "Twitter"
                        } : ${username}, on wallet ${wallet}.`,
                        isError: true,
                    });
                    return;
                }

                console.log(`** Pending Reward: Create reward for user wallet: ${wallet} **`);
                let pendingReward = await createPendingReward(rewardTypeId, quantity, user.wallet);

                if (!pendingReward) {
                    return res.status(422).json({
                        isError: true,
                        message: `Cannot add pending reward for user ${user.wallet}`,
                    });
                }

                if (showInDiscord) {
                    switch (pendingReward.rewardType.reward) {
                        case Enums.REWARDTYPE.MYSTERYBOWL:
                            pendingReward.imageUrl = `${NEXT_PUBLIC_WEBSITE_HOST}/img/sharing-ui/invite/shop.gif`;
                            break;
                        case Enums.REWARDTYPE.NUDE:
                            pendingReward.imageUrl = `${NEXT_PUBLIC_WEBSITE_HOST}/img/sharing-ui/invite/15.gif`;
                            break;
                        case Enums.REWARDTYPE.BOREDAPE:
                            pendingReward.imageUrl = `${NEXT_PUBLIC_WEBSITE_HOST}/img/sharing-ui/invite/11.gif`;
                            break;
                        case Enums.REWARDTYPE.MINTLIST:
                            pendingReward.imageUrl = `${NEXT_PUBLIC_WEBSITE_HOST}/img/sharing-ui/invite/chest_opened_175f.gif`;
                            break;
                        default:
                            pendingReward.imageUrl = `${NEXT_PUBLIC_WEBSITE_HOST}/img/sharing-ui/invite/shop.gif`;
                            break;
                    }

                    if (user.discordId != null && user.discordId.trim().length > 0) {
                        pendingReward.receivingUser = `<@${user.discordId.trim()}>`;
                    } else {
                        pendingReward.receivingUser = pendingReward.user.wallet;
                    }
                    console.log("test pending reward on nodejs");
                    await axios
                        .post(
                            `${DISCORD_NODEJS}/api/v1/channels/${DISCORD_REWARD_CHANNEL}/pendingReward`,
                            {
                                pendingReward,
                            },
                            {
                                headers: {
                                    Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
                                    "Content-Type": "application/json",
                                },
                            }
                        )
                        .catch((err) => {
                            console.log(err);
                        });
                }

                res.status(200).json(pendingReward);
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
