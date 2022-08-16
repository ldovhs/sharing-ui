import { prisma } from "@context/PrismaContext";
import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";
import axios from "axios";
import Enums from "enums";

const { DISCORD_NODEJS, NEXT_PUBLIC_WEBSITE_HOST, NODEJS_SECRET, NEXT_PUBLIC_ORIGIN_HOST } =
    process.env;

const SHELL_PRICE = Enums.SHELL_PRICE;

const shellRedeemRollAllAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            try {
                const whiteListUser = req.whiteListUser;

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

                //query shell amount
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
                if (!userReward || userReward.quantity < SHELL_PRICE) {
                    console.log("Cannot redeem")
                    res.status(200).json({ message: "Cannot redeem", isError: true });
                }

                let claimableRewards = Math.floor(userReward.quantity / SHELL_PRICE)

                // hacked account too much shell
                if (userShellRedeem.rewards.length < claimableRewards) {
                    // too use a max roll reward CONSTANT
                    claimableRewards = userShellRedeem.rewards.length;
                }
                let reduceShellQty = claimableRewards * SHELL_PRICE;

                let updateShellRedeemed;
                // if (userShellRedeem.rewards === null || userShellRedeem.rewards?.length === 0 || userShellRedeem.rewards?.length < claimableRewards) {
                if (userShellRedeem.rewards === null || userShellRedeem.rewards?.length === 0) {
                    // new user 
                } else {
                    updateShellRedeemed = await redeemReward(claimableRewards, reduceShellQty, wallet, rewardTypeId)
                }

                res.status(200).json(updateShellRedeemed);
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
        let updateUserReward = prisma.reward.update({
            where: {
                wallet_rewardTypeId: { wallet, rewardTypeId },
            },
            data: {
                quantity: {
                    decrement: reduceShellQty,
                },
            },
        });

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

        await prisma.$transaction([updateUserReward, updateShellRedeemed]);
        return updateShellRedeemed;
    } catch (error) {
        console.log(error);
    }
};
