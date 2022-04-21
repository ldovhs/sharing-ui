import { prisma } from "context/PrismaContext";

export const createPendingReward = async (rewardTypeId, quantity, wallet) => {
    return await prisma.pendingReward.create({
        data: {
            quantity,
            isClaimed: false,
            rewardType: {
                connect: {
                    id: parseInt(rewardTypeId),
                },
            },
            user: {
                connect: {
                    wallet,
                },
            },
        },
        include: {
            rewardType: true,
            user: true,
        },
    });
};

export const searchPendingRewardBasedOnGeneratedURL = async (generatedURL, wallet) => {
    return await prisma.pendingReward.findFirst({
        where: {
            generatedURL,
            wallet,
        },
        include: {
            rewardType: true,
        },
    });
};

export const getClaimedRewardsOfUser = async (wallet) => {
    return await prisma.reward.findMany({
        where: { wallet },
        include: { rewardType: true },
    });
};
