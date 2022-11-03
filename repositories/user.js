import { prisma } from "@context/PrismaContext";

export const getWhiteListUserByUserName = async (username) => {
    return await prisma.whiteList.findFirst({
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
                {
                    twitterUserName: username,
                },
            ],
        },
    });
};

export const getWhiteListUserByWallet = async (wallet) => {
    // 0xe90344f1526b04a59294d578e85a8a08d4fd6e0b
    // 0xe90344F1526B04a59294d578e85a8a08D4fD6e0b
    return await prisma.whiteList.findFirst({
        where: {
            // wallet,
            wallet: { equals: wallet, mode: "insensitive" },
        },
    });
};

export const getWhiteListUserByUserId = async (userId) => {
    return await prisma.whiteList.findUnique({
        where: {
            userId,
        },
    });
};

export const addNewUser = async (wallet) => {
    return await prisma.whiteList.create({
        data: {
            wallet,
            discordId: null,
            discordUserDiscriminator: null,
            twitterId: null,
            twitterUserName: null,
        },
    });
};
