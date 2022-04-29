import { prisma } from "@context/PrismaContext";
import Enums from "enums";
import axios from "axios";
import { createPendingReward } from "repositories/reward";
import adminMiddleware from "middlewares/adminMiddleware";

const { DISCORD_NODEJS, NEXT_PUBLIC_WEBSITE_HOST, NODEJS_SECRET } = process.env;

const ROUTE = "/api/admin/reward/addPending";

const AddPendingRewardAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        /*  
            @dev Create a new pending reward
            0. Check if req is from an admin
            1. Look for user in database if exists
            2. Create a pending reward since we found the user
            3. Show in discord if ShowInDiscord is true
        */
        case "POST":
            try {
                const {
                    username,
                    type,
                    wallet,
                    rewardTypeId,
                    quantity,
                    postInBotChannel,
                    postInGeneralChannel,
                } = req.body;

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
                    return res.status(200).json({
                        isError: true,
                        message: `Cannot add pending reward for user ${user.wallet}`,
                    });
                }

                if (postInBotChannel || postInGeneralChannel) {
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

                    await axios
                        .post(
                            `${DISCORD_NODEJS}/api/v1/channels/pendingReward`,
                            {
                                pendingReward,
                                postInDiscord: { postInBotChannel, postInGeneralChannel },
                            },
                            {
                                headers: {
                                    Authorization: `Bot ${NODEJS_SECRET}`,
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
};

export default adminMiddleware(AddPendingRewardAPI);
