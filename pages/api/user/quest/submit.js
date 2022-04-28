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

                console.log(`**Ensure user has not submitted this quest.**`);
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

                let userQuest = await submitNewUserQuestTransaction(req.body, whiteListUser.wallet);
                if (!userQuest) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "User Quest cannot be submitted!" });
                }

                let updateQuest;

                if (type === Enums.ANOMURA_SUBMISSION_QUEST) {
                    // TODO
                    let discordMsg = await discordHelper(whiteListUser, extendedQuestData);

                    // need a better handling
                    if (!discordMsg) {
                        console.log(`**Cannot post message to discord**`);
                    }

                    let extendedUserQuestData = {
                        ...extendedQuestData,
                        messageId: discordMsg.data.id,
                    };

                    updateQuest = await updateUserQuest(
                        whiteListUser.wallet,
                        questId,
                        rewardTypeId,
                        quantity,
                        extendedUserQuestData
                    );
                }
                // FOR OTHER QUEST TYPES
                else {
                    updateQuest = await updateUserQuest(
                        whiteListUser.wallet,
                        questId,
                        rewardTypeId,
                        quantity
                    );
                }

                res.status(200).json(updateQuest);
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

const discordHelper = async (user, extendedQuestData) => {
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
        `${DISCORD_NODEJS}/api/v1/channels/questSubmission`,
        {
            user,
            imageUrl,
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

export default whitelistUserMiddleware(submitIndividualQuestAPI);
