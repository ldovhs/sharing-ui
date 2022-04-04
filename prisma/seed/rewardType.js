const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const rewardTypes = [
    { id: 1, reward: "Mystery Bowl" },
    { id: 2, reward: "Nude" },
    { id: 3, reward: "Bored Ape" },
    { id: 4, reward: "Mint List" },
    { id: 9, reward: "Shell" },
];

async function main() {
    console.log("Seeding prisma rewardTypes db");

    for (let i = 0; i < rewardTypes.length; i++) {
        const user = await prisma.rewardType.upsert({
            where: { id: -1 },
            update: { reward: rewardTypes[i] },
            create: {
                reward: rewardTypes[i],
            },
        });

        console.log({ user });
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
