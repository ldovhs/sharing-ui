const { PrismaClient, EquipmentType } = require("@prisma/client");
const Enums = require("../enums");
const prisma = new PrismaClient();


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

    await assignSingleReward(Enums.OCTOHEDZ_VX_NFT);
    await assignSingleReward(Enums.OCTOHEDZ_RELOADED);
    await assignSingleReward(Enums.COLORMONSTER_NFT);
    await assignSingleReward(Enums.MIRAKAI_SCROLLS_NFT);
    await assignSingleReward(Enums.ALLSTARZ_NFT);
    await assignSingleReward(Enums.ETHER_JUMP_NFT);
    await assignSingleReward(Enums.META_HERO_NFT);
    await assignSingleReward(Enums.EX_8102_NFT);
    await assignSingleReward(Enums.NAME_INGAME);

    await assignMultipleRewards(Enums.FREE_MINT, 10);
    await assignMultipleRewards(Enums.ANOMURA_DOWNLOADABLE_STUFFS, 200);
    await assignMultipleRewards(Enums.MINT_LIST_SPOT, 7000);// 7000
    await assignMultipleRewards(Enums.GIFT_MINT_LIST_SPOT, 3000)
}

const assignSingleReward = async (rewardName) => {
    const whiteListUserRedeemed = await prisma.$queryRaw`
        SELECT  wl."wallet", srd."rewards"    
           from public."WhiteList" wl 
           left join public."shellRedeemed" srd on wl."wallet" = srd."wallet"
           where 1=1
               and wl."wallet" in (
                   '0xe90344F1526B04a59294d578e85a8a08D4fD6e0b',
                   '0xd77aB381e769D330E50d9F32ecdd216474F4e386',
                   '0x2C3B79b4FB76B2BDE07D457ecE647f1c63885418',
                   '0xb61193014Fc983b3475d6bF365B7647c2E52b713',
                   '0xBFF9B8D0aF518cb3d4b733FCa0627D7f3BbeEc42',
                   '0xF9132814b9CAc452d5FE9792e102E7Dde41807e3',
                   '0x6b2210bEd7E8f2d946C4258Cc3C0c19B7e4f397c',
                   '0xfb11EAFa478C6D65E7c001a6f40a79A7Ac0E663e',
                   '0x2E9ef3698E6CbDd14Ee73518407B2909952e0f50',
                   '0x102f6CED956fe9C9f7f499B61A2d38c0029e80d8',
                   '0xc08f1F50B7d926d0c60888220176c27CE55dA926',
                   '0x2fe1d1B26401a922D19E1E74bed2bA799c64E040')
                   and srd.rewards is null
            `
    let walletToReward = whiteListUserRedeemed[Math.floor(Math.random() * whiteListUserRedeemed.length)].wallet;

    // create reward in shell redeemed
    await prisma.shellRedeemed.upsert({
        where: { wallet: walletToReward },
        update: {
            rewards: {
                push: rewardName
            }
        },
        create: {
            wallet: walletToReward,
            rewards:
                [rewardName]

        }
    })
}

const assignMultipleRewards = async (rewardType, numberOfReward) => {
    const walletList = [...testingWallets]

    for (let i = 0; i < numberOfReward; i++) {
        let walletIndexToReward, walletToReward
        walletIndexToReward = Math.floor(Math.random() * walletList.length);
        walletToReward = walletList[walletIndexToReward]

        await prisma.shellRedeemed.upsert({
            where: { wallet: walletToReward },
            update: {
                rewards: {
                    push: rewardType
                }
            },
            create: {
                wallet: walletToReward,
                rewards:
                    [rewardType]

            }
        })

        walletList.splice(walletIndexToReward, 1)
        if (walletList.length === 0) {
            break;
        }
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
