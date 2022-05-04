const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();
const CryptoJS = require("crypto-js");

const adminAddresses = [
    "0x4D6EAEd5a1d1E631bbB6B3b4c6bedc4251d2DDF6",
    "0xd77aB381e769D330E50d9F32ecdd216474F4e386",
    "0x2C3B79b4FB76B2BDE07D457ecE647f1c63885418",
    "0xb61193014Fc983b3475d6bF365B7647c2E52b713",
    "0xBFF9B8D0aF518cb3d4b733FCa0627D7f3BbeEc42",
    "0xF9132814b9CAc452d5FE9792e102E7Dde41807e3",
    "0x6b2210bEd7E8f2d946C4258Cc3C0c19B7e4f397c",
    "0xfb11EAFa478C6D65E7c001a6f40a79A7Ac0E663e",
];

async function main() {
    // await prisma.reward.deleteMany();
    // await prisma.whiteList.deleteMany();
    console.log("Seeding prisma admin db");

    for (let i = 0; i < adminAddresses.length; i++) {
        const nonce = CryptoJS.lib.WordArray.random(16).toString();
        const user1 = await prisma.Admin.upsert({
            where: { wallet: adminAddresses[i] },
            update: { nonce },
            create: {
                wallet: adminAddresses[i],
                nonce,
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
