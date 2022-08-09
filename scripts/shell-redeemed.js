const { PrismaClient, EquipmentType } = require("@prisma/client");
const prisma = new PrismaClient();

const OCTOHEDZ_VX_NFT = "OctoHedz: VX NFT"
const OCTOHEDZ_RELOADED = "OctoHedz: Reloaded"
const COLORMONSTER_NFT = "ColorMonsters NFT"
const MIRAKAI_SCROLLS_NFT = "Mirakai Scrolls NFT"
const ALLSTARZ_NFT = "Allstarz NFT"
const ETHER_JUMP_NFT = "Etherjump NFT"
const META_HERO_NFT = "MetaHero NFT"
const EX_8102_NFT = "8102 NFT"

const NAME_INGAME = "Name a character in-game"
const ADOPT_ANIMAL = "Adopt an animal"

const FREE_MINT = "Free mint!"

const EARLY_ACCESS = "Early access to game concept"
const ONE_TO_ONE = "1:1 time with Anomura/ZED Run/HP team member"
const ANOMURA_STICKER = "Anomura sticker pack or merch"

const ANOMURA_PFP = "Anomura PFP"

const ANOMURA_DOWNLOADABLE_STUFFS = "Anomura downloadable desktop/mobile wallpaper/Twitter banner"

const GIFT_MINT_LIST_SPOT = "Gift a mintlist spot to a fren"

const MINT_LIST_SPOT = "Mintlist spot"


const testingWallets = [
    "0xe90344F1526B04a59294d578e85a8a08D4fD6e0b",
    "0xd77aB381e769D330E50d9F32ecdd216474F4e386",
    "0x2C3B79b4FB76B2BDE07D457ecE647f1c63885418",
    "0xb61193014Fc983b3475d6bF365B7647c2E52b713",
    "0xBFF9B8D0aF518cb3d4b733FCa0627D7f3BbeEc42",
    "0xF9132814b9CAc452d5FE9792e102E7Dde41807e3",
    "0x6b2210bEd7E8f2d946C4258Cc3C0c19B7e4f397c",
    "0xfb11EAFa478C6D65E7c001a6f40a79A7Ac0E663e",
    "0x2E9ef3698E6CbDd14Ee73518407B2909952e0f50",
    "0x102f6CED956fe9C9f7f499B61A2d38c0029e80d8",
    "0xc08f1F50B7d926d0c60888220176c27CE55dA926",
    "0x2fe1d1B26401a922D19E1E74bed2bA799c64E040"
]
async function main() {

    //     const whiteListUserReward = await prisma.$queryRaw`
    // SELECT 
    //     rw."quantity", 
    //     rw."wallet", 
    //     wl."discordUserDiscriminator", 
    //     wl."twitterUserName", 
    //     wl."createdAt", -- wla."wallet",
    // 	    CASE WHEN wla."wallet" IS NULL then 'Not In Guild' else 'In Guild' end IsInGuild
    //             from public."Reward" rw 
    //             join public."WhiteList" wl on wl."wallet" = rw."wallet"
    //             left join public."WhiteListAddress" wla on wla."wallet" = wl."wallet"
    //             where 1=1
    //                 --and	wl."discordUserDiscriminator" is not null
    //                 --and	wl."twitterUserName" is not null	
    //     order by 1 desc`

    //     console.log(whiteListUserReward)


    assignOctohedzVxNft();
    // assignOctohedzReloaded();
    // assignColorMonsterNft();
    // assignMirakaiNft();
    // assignAllStarzNft();
    // assignEtherJumpNft();
    // assignMetaHeroNft();
    // assign8102Nft();
}

const assignOctohedzVxNft = () => {
    let walletToReward, walletRedeem
    do {
        walletToReward = testingWallets[Math.floor(Math.random() * testingWallets.length)];
        walletRedeem = await prisma.shellRedeemed.findUnique({
            where: { wallet: walletToReward }
        })

    } while (walletRedeem?.rewards?.length > 0)


    // create reward in shell redeemed
    await prisma.shellRedeemed.upsert({
        where: { wallet: walletToReward },
        update: {
            rewards: {
                push: OCTOHEDZ_VX_NFT
            }
        },
        create: {
            wallet: walletToReward,
            rewards: {
                push: OCTOHEDZ_VX_NFT
            }
        }
    })
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
