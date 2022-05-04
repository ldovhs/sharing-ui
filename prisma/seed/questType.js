const { PrismaClient } = require("@prisma/client");
const Enums = require("../../enums");
const prisma = new PrismaClient();

const questTypes = [
    {
        id: 1,
        type: Enums.DISCORD_AUTH,
    },
    {
        id: 2,
        type: Enums.TWITTER_AUTH,
    },
    {
        id: 3,
        type: Enums.FOLLOW_TWITTER,
    },
    {
        id: 4,
        type: Enums.FOLLOW_INSTAGRAM,
    },
    {
        id: 5,
        type: Enums.TWITTER_RETWEET,
    },
    {
        id: 6,
        type: Enums.ANOMURA_SUBMISSION_QUEST,
    },
];

async function main() {
    console.log("Seeding prisma questType db");

    for (let i = 0; i < questTypes.length; i++) {
        // const newQuest = await prisma.questType.upsert({
        //     where: { id: i },
        //     update: { name: questTypes[i].type },
        //     create: {
        //         name: questTypes[i].type,
        //     },
        // });
        const newQuest = await prisma.questType.create({
            data: {
                name: questTypes[i].type,
            },
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
