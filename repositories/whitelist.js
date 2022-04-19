import { prisma } from "context/PrismaContext";

export const getWhitelistByWallet = async (wallet) => {
    return prisma.whiteList.findUnique({
        where: { wallet },
    });
};
