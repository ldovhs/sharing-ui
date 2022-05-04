const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

const rewardItems = ["Mystery Bowl", "Nude", "Bored Ape", "MintList"];

function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

async function main() {
    await prisma.reward.deleteMany();
    await prisma.whiteList.deleteMany();

    for (let i = 1; i <= 100; i++) {
        let rewardIndex = randomIntFromInterval(0, 3);
        let type1 = rewardItems[rewardIndex];
        let secondIndex = rewardIndex === 0 ? rewardIndex + 1 : rewardIndex - 1;
        let type2 = rewardItems[secondIndex];

        const user1 = await prisma.whiteList.upsert({
            where: { id: -1 },
            update: {},
            create: {
                wallet: faker.finance.ethereumAddress(),
                discordId: faker.internet.userName(),
                twitterId: faker.internet.userName(),
                rewards: {
                    create: [
                        {
                            type: type1,
                            quantity: randomIntFromInterval(1, 500),
                        },
                        {
                            type: type2,
                            quantity: randomIntFromInterval(1, 500),
                        },
                    ],
                },
            },
        });

        console.log({ user1 });
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
