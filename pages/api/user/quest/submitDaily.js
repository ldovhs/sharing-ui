import { prisma } from "@context/PrismaContext";
import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";
import axios from "axios";

import Enums from "enums";
import { submitNewUserQuestTransaction } from "repositories/transactions";
import { updateUserQuest } from "repositories/userQuest";

const { NEXT_PUBLIC_WEBSITE_HOST, NODEJS_SECRET } = process.env;

const ROUTE = "/api/user/submitDaily";

const submitIndividualDailyQuestAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            try {
                const whiteListUser = req.whiteListUser;
                const { questId, type, rewardTypeId, quantity, extendedQuestData } = req.body;

                let entry = await prisma.UserQuest.findUnique({
                    where: {
                        wallet_questId: { wallet: whiteListUser.wallet, questId },
                    },
                });
                if (!entry) {
                    // return res
                    //     .status(200)
                    //     .json({ isError: true, message: "This quest already submitted before!" });
                    let newExtendedQuestData = extendedQuestData;
                    if (
                        newExtendedQuestData.frequently &&
                        newExtendedQuestData.frequently === "daily"
                    ) {
                        const withoutTime = new Date().toISOString().split("T");
                        newExtendedQuestData.date = withoutTime;
                    }
                    if (
                        newExtendedQuestData.frequently &&
                        newExtendedQuestData.frequently === "hourly"
                    ) {
                        const withTime = new Date().toISOString();
                        newExtendedQuestData.date = withTime;
                    }

                    let userQuest = await submitUserDailyQuestTransaction(
                        questId,
                        type,
                        rewardTypeId,
                        quantity,
                        newExtendedQuestData,
                        whiteListUser.wallet
                    );
                    if (!userQuest) {
                        return res
                            .status(200)
                            .json({ isError: true, message: "User Quest cannot be submitted!" });
                    }

                    return res.status(200).json(userQuest);
                } else {
                    let updateQuest;
                    return res.status(200).json(updateQuest);
                }

                // if (type === Enums.IMAGE_UPLOAD_QUEST) {
                //     let extendedUserQuestData = {
                //         ...extendedQuestData,
                //         messageId: discordMsg.data.id,
                //     };

                //     updateQuest = await updateUserQuest(
                //         whiteListUser.wallet,
                //         questId,
                //         rewardTypeId,
                //         quantity,
                //         extendedUserQuestData
                //     );
                // }
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

export default whitelistUserMiddleware(submitIndividualDailyQuestAPI);

const submitUserDailyQuestTransaction = async (
    questId,
    type,
    rewardTypeId,
    quantity,
    extendedQuestData,
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
        },
    });

    await prisma.$transaction([claimedReward, userQuest]);

    return userQuest;
};
