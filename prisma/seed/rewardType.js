const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const rewardTypes = ["Mystery Bowl", "Nude", "Bored Ape", "Mint List"];

async function main() {
    console.log("Seeding prisma rewardTypes db");

    for (let i = 0; i < rewardTypes.length; i++) {
        const user = await prisma.rewardType.upsert({
            where: { id: -1 },
            update: {},
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
