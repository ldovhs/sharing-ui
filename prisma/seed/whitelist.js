const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();
const CryptoJS = require("crypto-js");

const whitelistAddresses = [
    {
        //quan
        twitter: " ",
        discordId: "quan#9868",
        wallet: "0x4D6EAEd5a1d1E631bbB6B3b4c6bedc4251d2DDF6",
    },

    {
        //daniele
        twitter: " ",
        discordId: "TheBlindLynx#2757",
        wallet: "0xd77aB381e769D330E50d9F32ecdd216474F4e386",
    },

    {
        //bernice
        twitter: " ",
        discordId: "bean#6856",
        wallet: "0x2C3B79b4FB76B2BDE07D457ecE647f1c63885418",
    },

    {
        //long
        twitter: " ",
        discordId: " ",
        wallet: "0xb61193014Fc983b3475d6bF365B7647c2E52b713",
    },

    {
        // jonathan
        twitter: " ",
        discordId: "8BITSPERPLAY#8217",
        wallet: "0xBFF9B8D0aF518cb3d4b733FCa0627D7f3BbeEc42",
    },
];

async function main() {
    // await prisma.reward.deleteMany();
    // await prisma.whiteList.deleteMany();
    console.log("Seeding prisma whitelist db");

    for (let i = 0; i < whitelistAddresses.length; i++) {
        const user = await prisma.whiteList.upsert({
            where: { wallet: whitelistAddresses[i].wallet },
            update: {},
            create: {
                wallet: whitelistAddresses[i].wallet,
                discordId: whitelistAddresses[i].discordId,
                twitter: whitelistAddresses[i].twitter,
                numberOfInvites: 0,
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
