import { prisma } from "context/PrismaContext";
import { getSession } from "next-auth/react";
import Enums from "enums";

/* non protected route*/
export default async function QuestUpsert(req, res) {
    const { method } = req;
    const session = await getSession({ req });

    switch (method) {
        case "GET":
            try {
                throw new Error("Not implemented");
                res.status(200).json(types);
            } catch (err) {
                console.log(err);
                res.status(500).json({ err });
            }
            break;

        case "POST":
            /*  
                    @dev Create a new pending reward
    
                    0. Check if req is from an admin
                    1. Look for user in database if exists
                    2. Create a pending reward since we found the user
                    3. Show in discord if ShowInDiscord is true
                    4. TODO: Post on main Twitter account in order to get the tweetId for Tweeting later?
                */
            //console.log(session);
            if (!session || !session.user?.isAdmin) {
                return res.status(400).json({
                    message: "Not authenticated to upsert quest",
                    isError: true,
                });
            }

            try {
                const {
                    id,
                    type,
                    description,
                    text,
                    completedText,
                    rewardTypeId,
                    quantity,
                    isEnabled,
                    isRequired,
                } = req.body;
                //  console.log(req.body);

                // let userCondition = { wallet };

                // if (type === Enums.DISCORD && username.trim().length > 0) {
                //     userCondition = { ...userCondition, discordId: username };
                // }
                // if (type === Enums.TWITTER && username.trim().length > 0) {
                //     userCondition = { ...userCondition, twitter: username };
                // }
                // if (username.trim().length === 0) {
                //     userCondition = { ...userCondition, wallet };
                // }
                if (id === 0) {
                    //create new
                    //try to look for any existing quest with type == Discord auth or twitter auth
                    let existingQuests = await prisma.quest.findMany();
                    console.log(existingQuests[0]);

                    let discordAuthQuest = existingQuests.filter(
                        (q) => q.type === Enums.DISCORD_AUTH
                    );

                    let twitterAuthQuest = existingQuests.filter(
                        (q) => q.type === Enums.TWITTER_AUTH
                    );
                    console.log(discordAuthQuest?.length >= 1 && type === Enums.DISCORD_AUTH);
                    console.log(type === Enums.DISCORD_AUTH);
                    console.log(discordAuthQuest.length);
                    // console.log(twitterAuthQuest);
                    if (
                        (discordAuthQuest?.length >= 1 && type === Enums.DISCORD_AUTH) ||
                        (twitterAuthQuest?.length >= 1 && type === Enums.TWITTER_AUTH)
                    ) {
                        return res.status(200).json({
                            message: `Cannot add more than one quest of this quest type ${type} `,
                            isError: true,
                        });
                    }
                }

                console.log(`***** Upsert a quest`);
                let newQuest = await prisma.quest.upsert({
                    where: {
                        id: id || -1,
                    },
                    create: {
                        type,
                        description,
                        text,
                        completedText,
                        rewardType: {
                            connect: {
                                id: parseInt(rewardTypeId),
                            },
                        },
                        quantity,
                        isEnabled,
                        isRequired,
                        followAccount: req.body.followAccount ?? null,
                    },
                    update: {
                        description,
                        text,
                        completedText,
                        rewardType: {
                            connect: {
                                id: parseInt(rewardTypeId),
                            },
                        },
                        quantity,
                        isEnabled,
                        //isRequired,
                        followAccount: req.body.followAccount ?? null,
                    },
                });

                res.status(200).json(newQuest);
            } catch (err) {
                console.log(err);
                res.status(500).json({ err });
            }
            break;
        default:
            res.setHeader("Allow", ["GET", "PUT"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
