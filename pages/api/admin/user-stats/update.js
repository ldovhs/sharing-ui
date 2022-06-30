import { prisma } from "@context/PrismaContext";
import adminMiddleware from "middlewares/adminMiddleware";
import axios from "axios";

const ROUTE = "/api/admin/user-stats";

const adminUpdateUserStatsAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            const { contract, chainId } = req.body;

            try {
                let ownersInContract = []


                if (contract && contract.length > 0) {

                    // query db first
                    let data = await prisma.moralisNftData.findUnique({
                        where: {
                            contractAddress: contract
                        }
                    })

                    if (data && data.contractData !== null) {
                        ownersInContract = data.contractData
                    }

                    if (ownersInContract.length < 1) {
                        console.log(`handle nft owner through moralis`)
                        await handleGetNftOwnersRequest(contract, chainId)
                    } else {

                        let ms = new Date().getTime() + 86400000 * 10;

                        let tenDayFromUpdateAt = new Date(data.updatedAt).getTime() + 86400000 * 2
                        let [tendayFromLastUpdatedAt] = new Date(tenDayFromUpdateAt).toISOString().split("T");
                        let [today] = new Date().toISOString().split("T");

                        if (tendayFromLastUpdatedAt < today) {
                            console.log(`there is data, but we check last updated, asit is more than 2 days so we use moralis`)
                            await handleGetNftOwnersRequest(contract, chainId)
                        }
                        else {
                            console.log(`nft data found, no need moralis`)
                            return res.status(200).json(ownersInContract);
                        }
                    }
                }

                console.log("likely its good to go now, just do the query")
                let data = await prisma.moralisNftData.findUnique({
                    where: {
                        contractAddress: contract
                    }
                })
                ownersInContract = data.contractData
                return res.status(200).json(ownersInContract);

            } catch (err) {
                console.log(err.message)
                res.status(500).json({ err: err.message });
            }
            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default adminMiddleware(adminUpdateUserStatsAPI);
const timer = ms => new Promise(res => setTimeout(res, ms))

const handleGetNftOwnersRequest = async (contractAddress, chainId) => {
    let res = await axios
        .post(
            `${process.env.DISCORD_NODEJS}/api/v1/user-stats/getContractOwnersJobRequest`,
            {
                contractAddress, chainId
            },
            {
                headers: {
                    Authorization: `Bot ${process.env.NODEJS_SECRET}`,
                    "Content-Type": "application/json",
                },
            }
        )
        .catch((err) => {
            console.log(err);
        });

    let bullJob
    do {

        bullJob = await prisma.bullJob.findUnique({
            where: {
                jobId: res.data.jobId
            },
        })
        await timer(2000)
    } while (bullJob?.state !== "completed")
};
