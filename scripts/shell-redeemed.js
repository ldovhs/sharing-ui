const { PrismaClient, EquipmentType } = require("@prisma/client");
const Enums = require("../enums");
const prisma = new PrismaClient();

async function main() {
    /* GREEN REWARDS */
    // await assignSingleReward(Enums.OCTOHEDZ_VX_NFT);
    // await assignSingleReward(Enums.OCTOHEDZ_RELOADED);
    // await assignSingleReward(Enums.COLORMONSTER_NFT);
    // await assignSingleReward(Enums.MIRAKAI_SCROLLS_NFT);
    // await assignSingleReward(Enums.ALLSTARZ_NFT);
    // await assignSingleReward(Enums.ETHER_JUMP_NFT);
    // await assignSingleReward(Enums.META_HERO_NFT);
    // await assignSingleReward(Enums.EX_8102_NFT);
    // await assignSingleReward(Enums.EX_8102_NFT);
    // await assignSingleReward(Enums.EX_8102_NFT);
    // await assignSingleReward(Enums.EX_8102_NFT);
    // await assignSingleReward(Enums.NAME_INGAME);

    /* PURPLE REWARDS */
    // await assignMultipleRewards(Enums.ADOPT_ANIMAL, 5);
    // await assignMultipleRewards(Enums.FREE_MINT, 10);
    // await assignMultipleRewards(Enums.ONE_TO_ONE, 30);
    // await assignMultipleRewards(Enums.ANOMURA_STICKER, 30);
    // await assignMultipleRewards(Enums.EARLY_ACCESS, 30);

    /* BLUE REWARDS */
    // await assignMultipleRewards(Enums.ANOMURA_PFP, 100); // avatar
    // await assignMultipleRewards(Enums.ANOMURA_DOWNLOADABLE_STUFFS, 200); // crab swag

    // At this point, there 417 users with 1 reward

    /* RED REWARDS */
    // query current mint list
    // let whiteListAddress = await prisma.whiteListAddress.findMany();

    // PHASE_1 GIFT_MINT_LIST_SPOT
    // await assignGiftMintListSpotPhase1(Enums.GIFT_MINT_LIST_SPOT);

    // let assignedWalletList = await assignMintListSpot(Enums.MINT_LIST_SPOT, 7000);// 7000

    // PHASE_2 GIFT_MINT_LIST_SPOT
    // await assignGiftMintListSpotPhase2(Enums.GIFT_MINT_LIST_SPOT);

    // assign everyone BOOTS
    // await assignBOOTS(Enums.BOOTS)
}

const assignSingleReward = async (rewardName) => {
    const whiteListUserRedeemed = await prisma.$queryRaw`
                select distinct wl."twitterUserName", wl."discordUserDiscriminator", wl.wallet, srd."rewards"
                   from public."Reward" rw 
                   join public."WhiteList" wl on wl."wallet" = rw."wallet"
                   left join public."shellRedeemed" srd on wl."wallet" = srd."wallet"
                   left join public."WhiteListAddress" wla on wla."wallet" = wl."wallet"
                       where 1=1
                            and	( wl."discordUserDiscriminator" is not null or wl."twitterUserName" is not null)	
                            and srd.rewards is null
                               order by 2 desc
            `;
    // console.log(whiteListUserRedeemed)
    let walletToReward =
        whiteListUserRedeemed[Math.floor(Math.random() * whiteListUserRedeemed.length)].wallet;

    // create reward in shell redeemed table
    await prisma.shellRedeemed.upsert({
        where: { wallet: walletToReward },
        update: {
            rewards: {
                push: rewardName,
            },
        },
        create: {
            wallet: walletToReward,
            rewards: [rewardName],
        },
    });
};

const assignMultipleRewards = async (rewardType, numberOfReward) => {
    let whiteListUserRedeemed;

    if (
        rewardType === Enums.FREE_MINT ||
        rewardType === Enums.ADOPT_ANIMAL ||
        rewardType === Enums.EARLY_ACCESS ||
        rewardType === Enums.ONE_TO_ONE ||
        rewardType === Enums.ANOMURA_PFP
    ) {
        whiteListUserRedeemed = await prisma.$queryRaw`
            select wl.wallet, srd."rewards"
               from public."Reward" rw 
               join public."WhiteList" wl on wl."wallet" = rw."wallet"
               left join public."shellRedeemed" srd on wl."wallet" = srd."wallet"
               left join public."WhiteListAddress" wla on wla."wallet" = wl."wallet"
                   where 1=1  
                   and	( wl."discordUserDiscriminator" is not null or wl."twitterUserName" is not null)
                   and srd.rewards is null
                           order by 2 desc
            `;
    } else {
        whiteListUserRedeemed = await prisma.$queryRaw`
        select wl.wallet, srd."rewards"
           from public."Reward" rw 
           join public."WhiteList" wl on wl."wallet" = rw."wallet"
           left join public."shellRedeemed" srd on wl."wallet" = srd."wallet"
           left join public."WhiteListAddress" wla on wla."wallet" = wl."wallet"
               where 1=1  
               and srd.rewards is null
                       order by 2 desc
        `;
    }

    let walletList = whiteListUserRedeemed.map((el) => el["wallet"]);
    // console.log(walletList.length);
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
    // console.log(walletList.length)
};

// ~ 1000
const assignGiftMintListSpotPhase1 = async (rewardType) => {

    let whiteListAddress = await prisma.whiteListAddress.findMany();
    let walletList = whiteListAddress.map((el) => el["wallet"]);

    // console.log(walletList.length);
    for (let i = 0; i < walletList.length; i++) {
        walletToReward = walletList[i]

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
    }
    // console.log(walletList.length)
};

// not in guild
const assignMintListSpot = async (rewardType, numberOfReward) => {
    // do not assign to existing mint list address
    let whiteListUserRedeemed = await prisma.$queryRaw`
        select wl.wallet, wla."wallet" IsInGuid
            from public."WhiteList" wl
            left join public."WhiteListAddress" wla on wla."wallet" = wl."wallet"
                where 1=1 and wla."wallet" is null
        `;

    let walletList = whiteListUserRedeemed.map((el) => el["wallet"]);
    console.log(walletList.length);
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
    console.log(walletList.length)
    return walletList;
};

const assignBOOTS = async (rewardType) => {
    // do not assign to existing mint list address
    let whiteListUserRedeemed = await prisma.$queryRaw`
        select wl.wallet from public."WhiteList" wl
        `;

    let walletList = whiteListUserRedeemed.map((el) => el["wallet"]);

    for (let i = 0; i < walletList.length; i++) {
        walletToReward = walletList[i]

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
    }
    console.log(walletList.length)
};

const assignGiftMintListSpotPhase2 = async (rewardType) => {

    let whiteListAddress = await prisma.whiteListAddress.findMany();
    let walletList = whiteListAddress.map((el) => el["wallet"]);

    // console.log(walletList.length);
    for (let i = 0; i < walletList.length; i++) {
        walletToReward = walletList[i]

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
    }
    // console.log(walletList.length)
};

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

// const whiteListUserRedeemed = await prisma.$queryRaw`
//     SELECT  wl."wallet", srd."rewards"
//        from public."WhiteList" wl
//        left join public."shellRedeemed" srd on wl."wallet" = srd."wallet"
//        where 1=1
//            and wl."wallet" in (
//                '0xe90344F1526B04a59294d578e85a8a08D4fD6e0b',
//                '0xd77aB381e769D330E50d9F32ecdd216474F4e386',
//                '0x2C3B79b4FB76B2BDE07D457ecE647f1c63885418',
//                '0xb61193014Fc983b3475d6bF365B7647c2E52b713',
//                '0xBFF9B8D0aF518cb3d4b733FCa0627D7f3BbeEc42',
//                '0xF9132814b9CAc452d5FE9792e102E7Dde41807e3',
//                '0x6b2210bEd7E8f2d946C4258Cc3C0c19B7e4f397c',
//                '0xfb11EAFa478C6D65E7c001a6f40a79A7Ac0E663e',
//                '0x2E9ef3698E6CbDd14Ee73518407B2909952e0f50',
//                '0x102f6CED956fe9C9f7f499B61A2d38c0029e80d8',
//                '0xc08f1F50B7d926d0c60888220176c27CE55dA926',
//                '0x2fe1d1B26401a922D19E1E74bed2bA799c64E040')
//                and srd.rewards is null
//         `
