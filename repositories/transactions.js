import { prisma } from "context/PrismaContext";
import { utils } from "ethers";

export const updateTwitterUserAndAddRewardTransaction = async (quest, wallet, userInfo) => {
    let { questId, type, rewardTypeId, quantity, extendedQuestData } = quest;
    wallet = utils.getAddress(wallet);

    let claimedReward;

    console.log(`**Update user**`);
    const { id, username } = userInfo;

    if (!id || !username) {
        throw new Error("Cannot get twitter id or twitter username from auth");
    }

    const updatedUser = prisma.whiteList.update({
        where: { wallet },
        data: {
            twitterId: id,
            twitterUserName: username,
        },
    });

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

    await prisma.$transaction([updatedUser, claimedReward, userQuest]);
    return userQuest;
};

export const updateDiscordUserAndAddRewardTransaction = async (quest, wallet, userInfo) => {
    let { questId, type, rewardTypeId, quantity, extendedQuestData } = quest;
    wallet = utils.getAddress(wallet);

    let claimedReward;

    console.log(`**Update user**`);
    const { id, username, discriminator } = userInfo;
    const updatedUser = prisma.whiteList.update({
        where: { wallet },
        data: {
            discordId: id,
            discordUserDiscriminator: `${username}#${discriminator}`,
        },
    });

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

    await prisma.$transaction([updatedUser, claimedReward, userQuest]);
    return userQuest;
};

export const submitNewUserQuestTransaction = async (quest, wallet) => {
    let { questId, type, rewardTypeId, quantity, extendedQuestData } = quest;

    let extendedUserQuestData = { ...extendedQuestData };
    let claimedReward;
    if (quantity >= 0) {
    }
    console.log(wallet);
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
            // extendedUserQuestData
        },
    });

    await prisma.$transaction([claimedReward, userQuest]);

    return userQuest;
};

export const UpdateClaimAndPendingRewardTransaction = async (
    wallet,
    rewardTypeId,
    quantity,
    generatedURL
) => {
    console.log(`** Claiming Reward ${generatedURL} **`);
    let claimedReward = prisma.reward.upsert({
        where: {
            wallet_rewardTypeId: { wallet, rewardTypeId },
        },
        create: {
            wallet,
            quantity,
            rewardTypeId,
        },
        update: {
            quantity: {
                increment: quantity,
            },
        },
        select: {
            wallet: true,
            quantity: true,
            user: true,
            rewardTypeId: true,
            rewardType: true,
        },
    });

    console.log(`** Updating reward ${generatedURL} to claimed **`);
    let updatePendingReward = prisma.pendingReward.update({
        where: {
            wallet_rewardTypeId_generatedURL: {
                wallet,
                rewardTypeId,
                generatedURL,
            },
        },
        data: {
            isClaimed: true,
        },
    });

    await prisma.$transaction([claimedReward, updatePendingReward]);
    return claimedReward;
};
