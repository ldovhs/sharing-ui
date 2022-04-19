import { prisma } from "@context/PrismaContext";
import { getSession } from "next-auth/react";
import axios from "axios";
import { utils } from "ethers";
import { isWhitelistUser } from "repositories/session-auth";
import Enums from "enums";

const { DISCORD_BOT_TOKEN, DISCORD_REWARD_CHANNEL, NEXT_PUBLIC_WEBSITE_HOST } = process.env;

export default async function submitIndividualQuest(req, res) {
    const { method } = req;
    const session = await getSession({ req });
    switch (method) {
        // TODO: refactor
        case "POST":
            let userWallet = await isWhitelistUser(session);
            if (!userWallet) {
                return res.status(422).json({
                    message: "Non-user authenticated",
                    isError: true,
                });
            }

            if (
                !session ||
                !session.user ||
                session.user.address.toLowerCase() !== userWallet.toLowerCase()
            ) {
                return res.status(400).json({
                    message: "Not authenticated to submit a quest",
                    isError: true,
                });
            }

            try {
                const { questId, type, rewardTypeId, quantity, extendedQuestData } = req.body;

                console.log(`**Ensure user has not submitted this quest.**`);
                let entry = await prisma.UserQuest.findUnique({
                    where: {
                        wallet_questId: { wallet: userWallet, questId },
                    },
                });
                if (entry) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "This quest already submitted before!" });
                }

                let userQuest = await submitNewUserQuest(req.body, userWallet);

                let updateQuest;

                if (type === Enums.ANOMURA_SUBMISSION_QUEST) {
                    let discordMsg = await discordHelper(userWallet, extendedQuestData);

                    if (!discordMsg) {
                        console.log(`**something wrong posting discord message**`);
                    }

                    let extendedUserQuestData = {
                        ...extendedQuestData,
                        messageId: discordMsg.data.id,
                    };

                    updateQuest = await prisma.UserQuest.update({
                        where: {
                            wallet_questId: { wallet: userWallet, questId },
                        },
                        data: {
                            wallet: userWallet,
                            questId,
                            rewardedTypeId: rewardTypeId,
                            rewardedQty: quantity,
                            extendedUserQuestData,
                        },
                    });
                }
                // FOR OTHER QUEST TYPES
                else {
                    updateQuest = await prisma.UserQuest.update({
                        where: {
                            wallet_questId: { wallet: userWallet, questId },
                        },
                        data: {
                            wallet: userWallet,
                            questId,
                            rewardedTypeId: rewardTypeId,
                            rewardedQty: quantity,
                        },
                    });
                }

                return res.status(200).json(updateQuest);
            } catch (error) {
                console.log(error);
                return res.status(200).json({ isError: true, message: error.message });
            }

            break;
        default:
            res.setHeader("Allow", ["GET", "PUT"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}

const submitNewUserQuest = async (quest, wallet) => {
    let { questId, type, rewardTypeId, quantity, extendedQuestData } = quest;

    let extendedUserQuestData = { ...extendedQuestData };
    let claimedReward;
    if (quantity >= 0) {
    }

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

// TODO moving to nodejs later
const discordHelper = async (wallet, extendedQuestData) => {
    let discordChannel = extendedQuestData.discordChannel;

    let url = [
        `${NEXT_PUBLIC_WEBSITE_HOST}/img/test/01.png`,
        `${NEXT_PUBLIC_WEBSITE_HOST}/img/test/02.png`,
        `${NEXT_PUBLIC_WEBSITE_HOST}/img/test/03.png`,
        `${NEXT_PUBLIC_WEBSITE_HOST}/img/test/04.png`,
        `${NEXT_PUBLIC_WEBSITE_HOST}/img/test/05.png`,
        `${NEXT_PUBLIC_WEBSITE_HOST}/img/test/06.png`,
        `${NEXT_PUBLIC_WEBSITE_HOST}/img/test/07.png`,
        `${NEXT_PUBLIC_WEBSITE_HOST}/img/test/08.png`,
        `${NEXT_PUBLIC_WEBSITE_HOST}/img/test/09.png`,
        `${NEXT_PUBLIC_WEBSITE_HOST}/img/test/10.png`,
        `${NEXT_PUBLIC_WEBSITE_HOST}/img/test/11.png`,
        `${NEXT_PUBLIC_WEBSITE_HOST}/img/test/12.png`,
        `${NEXT_PUBLIC_WEBSITE_HOST}/img/test/13.png`,
        `${NEXT_PUBLIC_WEBSITE_HOST}/img/test/14.png`,
        `${NEXT_PUBLIC_WEBSITE_HOST}/img/test/15.png`,
    ];
    let imageUrl = url[Math.floor(Math.random() * url.length)];

    let discordPost = await axios.post(
        `https://discord.com/api/channels/${discordChannel}/messages`,
        {
            content: `** ${wallet} has submit their submission.** `,
            embeds: [
                {
                    image: {
                        url: imageUrl,
                    },
                },
            ],
        },
        {
            headers: {
                Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
                "Content-Type": "application/json",
            },
        }
    );

    // console.log(discordPost);
    return discordPost;
};
