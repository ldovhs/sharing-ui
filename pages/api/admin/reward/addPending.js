import { prisma } from "@context/PrismaContext";
import Enums from "enums";
import axios from "axios";
import { AddOrUpdateWhiteListAddressTable, createPendingReward, getRewardType } from "repositories/reward";
import adminMiddleware from "middlewares/adminMiddleware";

const { DISCORD_NODEJS, NEXT_PUBLIC_WEBSITE_HOST, NODEJS_SECRET, NEXT_PUBLIC_ORIGIN_HOST } =
    process.env;


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

                let user = await prisma.whiteList.findFirst({
                    where: userCondition,
                });

                if (!user) {
                    res.status(200).json({
                        message: `Cannot find any user with ${type === Enums.DISCORD ? "Discord Id" : "Twitter"
                            } : ${username}, on wallet ${wallet}.`,
                        isError: true,
                    });
                    return;
                }

                console.log(`** Pending Reward: Create reward for user**`);
                let pendingReward = await createPendingReward(rewardTypeId, quantity, user);

                if (!pendingReward) {
                    return res.status(200).json({
                        isError: true,
                        message: `Cannot add pending reward for user ${user.userId}`,
                    });
                }

                pendingReward.imageUrl = `${NEXT_PUBLIC_ORIGIN_HOST}/challenger/img/sharing-ui/invite/Treasure-Chest.gif`;
                pendingReward.embededLink = `${process.env.NEXT_PUBLIC_WEBSITE_HOST}${Enums.BASEPATH}/claim/${user.userId}?specialcode=${pendingReward.generatedURL}`;

                if (user.discordId != null && user.discordId.trim().length > 0) {
                    pendingReward.receivingUser = `<@${user.discordId.trim()}>`;
                } else if (user.wallet != null && user.wallet.trim().length > 0) {
                    pendingReward.receivingUser = pendingReward.user.wallet;
                } else {
                    pendingReward.receivingUser = pendingReward.user.userId;
                }

                await axios
                    .post(
                        `${DISCORD_NODEJS}/api/v1/channels/pendingReward`,
                        {
                            pendingReward,
                            postInDiscord: { postInBotChannel, postInGeneralChannel },
                            user
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


                res.status(200).json(pendingReward);
            } catch (err) {
                console.log(err)
                res.status(500).json({ err: err.message });
            }
            break;
        default:
            res.setHeader("Allow", ["GET", "PUT"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default adminMiddleware(AddPendingRewardAPI);
