import { prisma } from "@context/PrismaContext";
import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";
import axios from "axios";

import Enums from "enums";

const { NEXT_PUBLIC_WEBSITE_HOST, NODEJS_SECRET, DISCORD_NODEJS } = process.env;

const ROUTE = "/api/user/quest/submit-image";

const submitImageQuestAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            try {
                const whiteListUser = req.whiteListUser;
                const { questId, type, rewardTypeId, quantity, extendedQuestData, imageUrl } =
                    req.body;
                let userQuest;

                if (type.name !== Enums.IMAGE_UPLOAD_QUEST) {
                    return res.status(200).json({
                        isError: true,
                        message: "This route is only for image-upload quest!",
                    });
                }

                let entry = await prisma.UserQuest.findUnique({
                    where: {
                        wallet_questId: { wallet: whiteListUser.wallet, questId },
                    },
                });
                if (entry) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "This quest already submitted before!" });
                }

                /**
                 * 1. Post a message to discord channel
                 * 2. Add new UserQuest with discord message id
                 */
                // let discordMsg = await discordHelper(
                //     whiteListUser,
                //     extendedQuestData.discordChannel,
                //     imageUrl
                // );

                // if (!discordMsg) {
                //     return res.status(200).json({
                //         isError: true,
                //         message: "Image cannot be uploaded. Pls contact administrator!",
                //     });
                // }
                // if (!discordMsg?.data?.response?.id) {
                //     return res.status(200).json({
                //         isError: true,
                //         message:
                //             "Cannot get discord message id after uploaded. Pls contact administrator!",
                //     });
                // }

                let extendedUserQuestData = {
                    ...extendedQuestData,
                    // messageId: discordMsg?.data?.response?.id,
                    imageUrl,
                };

                let currentQuest = await prisma.quest.findUnique({
                    where: {
                        questId
                    }
                })

                console.log(currentQuest)

                userQuest = await submitNewUserImageQuestTransaction(
                    questId,
                    type,
                    rewardTypeId,
                    currentQuest.quantity,
                    extendedUserQuestData,
                    whiteListUser.wallet
                );
                if (!userQuest) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "User Quest cannot be submitted!" });
                }

                // updateQuest = await updateUserQuest(
                //     whiteListUser.wallet,
                //     questId,
                //     rewardTypeId,
                //     quantity,
                //     extendedUserQuestData
                // );

                return res.status(200).json(userQuest);
            } catch (error) {
                console.log(error);
                return res.status(200).json({ isError: true, message: error.message });
            }
            break;
        default:
            res.setHeader("Allow", ["GET", "PUT"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

const discordHelper = async (user, discordChannel, imageUrl) => {
    let discordPost = await axios.post(
        `${DISCORD_NODEJS}/api/v1/channels/image-quest`,
        {
            user,
            imageUrl,
            discordChannel,
        },
        {
            headers: {
                Authorization: `Bot ${NODEJS_SECRET}`,
                "Content-Type": "application/json",
            },
        }
    );

    return discordPost;
};

export default whitelistUserMiddleware(submitImageQuestAPI);

const submitNewUserImageQuestTransaction = async (
    questId,
    type,
    rewardTypeId,
    quantity,
    extendedUserQuestData,
    wallet
) => {
    let claimedReward;

    console.log(`**Create / Update reward for user**`);
    claimedReward = prisma.reward.upsert({
        where: {
            wallet_rewardTypeId: { wallet, rewardTypeId },
        },
        update: {
            quantity: {
                increment: quantity,
            },
        },
        create: {
            wallet,
            quantity,
            rewardTypeId,
        },

        select: {
            wallet: true,
            quantity: true,
            user: true,
            rewardTypeId: true,
            rewardType: true,
        },
    });

    console.log(`**Save to UserQuest, to keep track that its done**`);
    let userQuest = prisma.userQuest.create({
        data: {
            wallet,
            questId,
            rewardedTypeId: rewardTypeId,
            rewardedQty: quantity,
            extendedUserQuestData,
        },
    });

    await prisma.$transaction([claimedReward, userQuest]);

    return userQuest;
};
