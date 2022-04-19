const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();
const CryptoJS = require("crypto-js");

const whitelistAddresses = [
    {
        //quan
        twitterId: "",
        discordId: "220395544583995392",
        wallet: "0x4D6EAEd5a1d1E631bbB6B3b4c6bedc4251d2DDF6",
        discordUserDiscriminator: "quan#9868",
    },

    {
        //daniele
        twitterId: "",
        discordId: "358044468773126146",
        wallet: "0xd77aB381e769D330E50d9F32ecdd216474F4e386",
        discordUserDiscriminator: "TheBlindLynx#2757",
    },

    {
        //bernice
        twitterId: "",
        discordId: "681850659254829098",
        wallet: "0x2C3B79b4FB76B2BDE07D457ecE647f1c63885418",
        discordUserDiscriminator: "bean#6856",
    },

    {
        //long
        twitterId: "",
        discordId: "187236982978510851",
        wallet: "0xb61193014Fc983b3475d6bF365B7647c2E52b713",
        discordUserDiscriminator: "denials#2613",
    },

    {
        // jonathan
        twitterId: "",
        discordId: "207684904379482112",
        wallet: "0xBFF9B8D0aF518cb3d4b733FCa0627D7f3BbeEc42",
        discordUserDiscriminator: "8BITSPERPLAY#8217",
    },
    {
        // momo
        twitterId: "",
        discordId: "619631363762552842",
        wallet: "0xF9132814b9CAc452d5FE9792e102E7Dde41807e3",
        discordUserDiscriminator: "momomoo#3887",
    },
    {
        // zern / Issac
        twitterId: "",
        discordId: "79257676269236224",
        wallet: "0x6b2210bEd7E8f2d946C4258Cc3C0c19B7e4f397c",
        discordUserDiscriminator: "zern#0101",
    },
    {
        // Annie
        twitterId: "",
        discordId: "357853468679077893",
        wallet: "0xfb11EAFa478C6D65E7c001a6f40a79A7Ac0E663e",
        discordUserDiscriminator: "annie_#9799",
    },
];

async function main() {
    console.log("Seeding prisma whitelist db");

    for (let i = 0; i < whitelistAddresses.length; i++) {
        const user = await prisma.whiteList.upsert({
            where: { wallet: whitelistAddresses[i].wallet },
            update: {
                discordId: whitelistAddresses[i].discordId,
                discordUserDiscriminator: whitelistAddresses[i].discordUserDiscriminator,
            },
            create: {
                wallet: whitelistAddresses[i].wallet,
                discordId: whitelistAddresses[i].discordId,
                twitter: whitelistAddresses[i].twitter,
                discordUserDiscriminator: whitelistAddresses[i].discordUserDiscriminator,
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
