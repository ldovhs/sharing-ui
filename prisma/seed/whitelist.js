const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();
const CryptoJS = require("crypto-js");

const whitelistAddresses = [
    {
        //quan
        wallet: "0x4D6EAEd5a1d1E631bbB6B3b4c6bedc4251d2DDF6",
    },

    {
        //daniele
        wallet: "0xd77aB381e769D330E50d9F32ecdd216474F4e386",
    },

    {
        //bernice
        wallet: "0x2C3B79b4FB76B2BDE07D457ecE647f1c63885418",
    },

    {
        //long
        wallet: "0xb61193014Fc983b3475d6bF365B7647c2E52b713",
    },

    {
        // jonathan
        wallet: "0xBFF9B8D0aF518cb3d4b733FCa0627D7f3BbeEc42",
    },
    {
        // momo
        wallet: "0xF9132814b9CAc452d5FE9792e102E7Dde41807e3",
    },
    {
        // zern / Issac
        wallet: "0x6b2210bEd7E8f2d946C4258Cc3C0c19B7e4f397c",
    },
    {
        // Annie
        wallet: "0xfb11EAFa478C6D65E7c001a6f40a79A7Ac0E663e",
    },
];

async function main() {
    console.log("Seeding prisma whitelist db");

    for (let i = 0; i < whitelistAddresses.length; i++) {
        const user = await prisma.whiteList.create({
            data: {
                wallet: whitelistAddresses[i].wallet,
            },
        });

        // console.log({ user });
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
