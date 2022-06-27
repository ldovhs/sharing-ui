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
                console.log(chainId)

                if (contract && contract.length > 0) {
                    // check if contract address is a valid address first

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
                        console.log(`hanle nft owner through moralis`)
                        ownersInContract = await handleGetNftOwners(contract, chainId)
                    } else {
                        // there is data, but we check last updated, if it is more than 10 days then we use moralis
                        let ms = new Date().getTime() + 86400000 * 10;

                        let tenDayFromUpdateAt = new Date(data.updatedAt).getTime() + 86400000 * 10
                        let [tendayFromLastUpdatedAt] = new Date(tenDayFromUpdateAt).toISOString().split("T");
                        let [today] = new Date().toISOString().split("T");

                        if (tendayFromLastUpdatedAt < today) {
                            console.log(`hanle nft owner through moralis`)
                            ownersInContract = await handleGetNftOwners(contract, chainId)
                        }
                        else {
                            console.log(`nft data found, no need moralis`)
                        }
                    }
                }

                // save to db if we query from moralis
                if (ownersInContract.length > 0) {
                    await prisma.moralisNftData.upsert({
                        where: {
                            contractAddress: contract
                        },
                        update: {
                            contractData: ownersInContract
                        },
                        create: {
                            contractAddress: contract,
                            contractData: ownersInContract
                        }
                    })
                }

                return res.status(200).json(ownersInContract);

            } catch (err) {
                console.log(err)
                res.status(500).json({ err: err.message });
            }
            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default adminMiddleware(adminUpdateUserStatsAPI);

const handleGetNftOwners = async (contractAddress, chainId) => {

    // query moralis
    let cursor = "";
    let result = [];
    console.log(chainId)
    do {
        let response = await axios
            .get(
                `https://deep-index.moralis.io/api/v2/nft/${contractAddress}/owners?cursor=${cursor}&chain=${chainId}`,
                {
                    headers: {
                        "X-API-Key": process.env.NEXT_PUBLIC_MORALIS_APIKEY,
                    },
                }
            )

        let data = response.data;
        let headers = response.headers

        console.log(
            `Got page ${data.page} of ${Math.ceil(data.total / data.page_size)}, ${data.total
            } total \n`
        );

        for (const nft of data.result) {

            result = [...result, nft];
        }
        cursor = data.cursor;

        let rateLimit = parseInt(headers["x-rate-limit-limit"])
        let rateLimitUsed = parseInt(headers["x-rate-limit-used"])
        let requestWeight = parseInt(headers["x-request-weight"])

        if (rateLimitUsed + requestWeight > rateLimit) {
            console.log(`Rate Limit hit within 1 second, awaiting next window`)
            await timer(1000) // ~ 1 second
        }

    } while (cursor != "" && cursor != null);

    let owners = result.map(r => {
        return r["owner_of"]
    })

    return owners
};

const timer = ms => new Promise(res => setTimeout(res, ms))
