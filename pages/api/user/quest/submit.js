import { prisma } from "@context/PrismaContext";
import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";
import axios from "axios";

import Enums from "enums";
import { submitNewUserQuestTransaction } from "repositories/transactions";
import { updateUserQuest } from "repositories/userQuest";

const { NEXT_PUBLIC_WEBSITE_HOST, NODEJS_SECRET } = process.env;

const ROUTE = "/api/user/submit";

const submitIndividualQuestAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            try {
                const whiteListUser = req.whiteListUser;
                const { questId, type, rewardTypeId, quantity, extendedQuestData } = req.body;
                let userQuest;

                /** This route is not for image upload quest */
                if (type.name === Enums.IMAGE_UPLOAD_QUEST) {
                    return res.status(200).json({
                        isError: true,
                        message: "This route is not for image upload quest!",
                    });
                }

                // Handling daily quest
                if (type.name === Enums.DAILY_SHELL) {
                    console.log(`**In daily shell**`);

                    let extendedUserQuestData = { ...extendedQuestData };
                    if (
                        extendedUserQuestData.frequently &&
                        extendedUserQuestData.frequently === "daily"
                    ) {
                        const [withoutTime] = new Date().toISOString().split("T");
                        extendedUserQuestData.date = withoutTime;
                    }
                    if (
                        extendedUserQuestData.frequently &&
                        extendedUserQuestData.frequently === "hourly"
                    ) {
                        const withTime = new Date().toISOString();
                        extendedUserQuestData.date = withTime;
                    }

                    let currentQuest = await prisma.quest.findUnique({
                        where: {
                            questId
                        }
                    })

                    userQuest = await submitUserDailyQuestTransaction(
                        questId,
                        type,
                        rewardTypeId,
                        currentQuest.quantity,
                        extendedUserQuestData,
                        whiteListUser.wallet
                    );
                    if (!userQuest) {
                        return res.status(200).json({
                            isError: true,
                            message: "User Quest cannot be submitted!",
                        });
                    }

                    return res.status(200).json(userQuest);
                }

                /* Rest of other quest */
                let entry = await prisma.UserQuest.findUnique({
                    where: {
                        wallet_questId: { wallet: whiteListUser.wallet, questId },
                    },
                });
                if (entry) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "This quest already submitted before!" });
                } else {
                    userQuest = await submitNewUserQuestTransaction(req.body, whiteListUser.wallet);
                    if (!userQuest) {
                        return res
                            .status(200)
                            .json({ isError: true, message: "User Quest cannot be submitted!" });
                    }
                }

                return res.status(200).json(userQuest);
            } catch (error) {
                // console.log(error);
                return res.status(200).json({ isError: true, message: error.message });
            }
            break;
        default:
            res.setHeader("Allow", ["GET", "PUT"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default whitelistUserMiddleware(submitIndividualQuestAPI);

const submitUserDailyQuestTransaction = async (
    questId,
    type,
    rewardTypeId,
    quantity,
    extendedUserQuestData,
    wallet
) => {
    let claimedReward;
    try {
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
        let userQuest = prisma.userQuest.upsert({
            where: {
                wallet_questId: { wallet, questId },
            },
            create: {
                wallet,
                questId,
                rewardedTypeId: rewardTypeId,
                rewardedQty: quantity,
                extendedUserQuestData,
            },
            update: {
                extendedUserQuestData,
            },
        });

        await prisma.$transaction([claimedReward, userQuest]);

        return userQuest;
    } catch (error) {
        console.log(error);
    }
};
