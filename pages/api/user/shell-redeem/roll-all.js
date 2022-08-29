import { prisma } from "@context/PrismaContext";
import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";
import axios from "axios";
import Enums from "enums";

const { DISCORD_NODEJS, NEXT_PUBLIC_WEBSITE_HOST, NODEJS_SECRET, NEXT_PUBLIC_ORIGIN_HOST } =
    process.env;

const SHELL_PRICE = Enums.SHELL_PRICE;
const MAX_ROLL_REDEEM = Enums.MAX_ROLL_REDEEM;
const shellRedeemRollAllAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            try {
                const whiteListUser = req.whiteListUser;

                if (process.env.NEXT_PUBLIC_CAN_REDEEM_SHELL === "false") {
                    return res.status(200).json({ isError: true, message: "shell redeem is not enabled." });
                }

                // DO NOT USE THE QUANTITY SENT TO API, USE THE QUANTITY QUERIED FROM DB

                /* 
                    1. Check if redeem? if redeemed, return
                    2. 
                    3. Query current shell quantity
                    4. If shell < 2000, then returned
                    5. Calculate how many rewards user can get based on shell
                    
                    6.
                        a. if claimableRewards <= userShellRedeem.rewardArray

                        b. if claimableRewards > userShellRedeem.rewardArray
                */
                let wallet = whiteListUser.wallet
                console.log(`** Assure this reward exists and not redeemed **`);
                let userShellRedeem = await prisma.shellRedeemed.findUnique({
                    where: {
                        wallet
                    }
                })
                if (userShellRedeem?.isRedeemed) {
                    res.status(200).json({ message: "Already redeemed", isError: true });
                }

                if (!userShellRedeem) {
                    let rewards = [Enums.BOOTS, Enums.ANOMURA_DOWNLOADABLE_STUFFS, Enums.ANOMURA_PFP]
                    await prisma.shellRedeemed.create({
                        data: {
                            isRedeemed: false,
                            rewardPointer: -1,
                            rewards,
                            wallet
                        },
                    });
                }

                let shellReward = await prisma.rewardType.findFirst({
                    where: {
                        reward: "$Shell"
                    }
                })
                let rewardTypeId = shellReward.id
                let userReward = await prisma.reward.findUnique({
                    where: {
                        wallet_rewardTypeId: { wallet, rewardTypeId },
                    },
                })

                //handle shell less than min roll price
                if (!userReward || userReward.quantity < SHELL_PRICE) {
                    console.log("inside less than min roll price")
                    let updateShellRedeemed = await redeemRewardForAccountLessThanMinimumRollPrice(wallet, rewardTypeId)
                    return res.status(200).json(updateShellRedeemed);
                }
                else {
                    let claimableRewards = Math.floor(userReward.quantity / SHELL_PRICE)

                    // maximum rollable to be less than config number
                    if (claimableRewards > MAX_ROLL_REDEEM) {
                        claimableRewards = MAX_ROLL_REDEEM
                    }
                    // hacked account too much shell
                    // if (userShellRedeem.rewards.length < claimableRewards) {
                    //     // too use a max roll reward CONSTANT
                    //     claimableRewards = userShellRedeem.rewards.length;
                    // }
                    let reduceShellQty = claimableRewards * SHELL_PRICE;

                    let updateShellRedeemed;
                    // if (userShellRedeem.rewards === null || userShellRedeem.rewards?.length === 0 || userShellRedeem.rewards?.length < claimableRewards) {
                    // if (userShellRedeem.rewards === null || userShellRedeem.rewards?.length === 0) {
                    //     // new user 
                    // } else {
                    //     updateShellRedeemed = await redeemReward(claimableRewards, reduceShellQty, wallet, rewardTypeId)
                    // }

                    updateShellRedeemed = await redeemReward(claimableRewards, reduceShellQty, wallet, rewardTypeId)
                    updateShellRedeemed.rewards = updateShellRedeemed.rewards.splice(0, updateShellRedeemed.rewardPointer + 1)
                    res.status(200).json(updateShellRedeemed);
                }


            } catch (err) {
                console.log(err)
                res.status(500).json({ error: err.message });
            }
            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default whitelistUserMiddleware(shellRedeemRollAllAPI);


const redeemReward = async (
    claimableRewards,
    reduceShellQty,
    wallet,
    rewardTypeId
) => {

    try {
        console.log(`**Update Reward for User Redeem**`);
        // let updateUserReward = prisma.reward.update({
        //     where: {
        //         wallet_rewardTypeId: { wallet, rewardTypeId },
        //     },
        //     data: {
        //         quantity: {
        //             decrement: reduceShellQty,
        //         },
        //     },
        // });

        console.log(`**Update ShellRedeem table**`);
        let updateShellRedeemed = prisma.shellRedeemed.update({
            where: {
                wallet,
            },
            data: {
                isRedeemed: true,
                rewardPointer: claimableRewards - 1
            },
        });

        // await prisma.$transaction([updateUserReward, updateShellRedeemed]);
        await prisma.$transaction([updateShellRedeemed]);
        return updateShellRedeemed;
    } catch (error) {
        console.log(error);
    }
};

const redeemRewardForAccountLessThanMinimumRollPrice = async (
    wallet,
    rewardTypeId
) => {

    try {
        console.log(`**Update Reward for User Redeem**`);
        // update shell to 0
        // let updateUserReward = prisma.reward.update({
        //     where: {
        //         wallet_rewardTypeId: { wallet, rewardTypeId },
        //     },
        //     data: {
        //         quantity: 0,
        //     },
        // });

        console.log(`**Update ShellRedeem table**`);

        let oneOrZero = (Math.random() > 0.5) ? 1 : 0

        let reward = oneOrZero === 1 ? Enums.BOOTS : Enums.ANOMURA_DOWNLOADABLE_STUFFS
        let updateShellRedeemed = prisma.shellRedeemed.upsert({
            where: {
                wallet,
            },
            create: {
                rewards: [reward],
                isRedeemed: true,
                rewardPointer: 0
            },
            update: {
                rewards: [reward],
                isRedeemed: true,
                rewardPointer: 0
            }
        });

        // await prisma.$transaction([updateUserReward, updateShellRedeemed]);
        await prisma.$transaction([updateShellRedeemed]);
        return updateShellRedeemed;
    } catch (error) {
        console.log(error);
    }
};
