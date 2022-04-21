import { prisma } from "context/PrismaContext";

export const updateUserQuest = async (
    wallet,
    questId,
    rewardedTypeId,
    rewardedQty,
    extendedUserQuestData = null
) => {
    return await prisma.UserQuest.update({
        where: {
            wallet_questId: { wallet, questId },
        },
        data: {
            rewardedTypeId,
            rewardedQty,
            extendedUserQuestData:
                extendedUserQuestData !== null ? extendedUserQuestData : undefined,
        },
    });
};
