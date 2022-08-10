import { prisma } from "@context/PrismaContext";
import whitelistUserMiddleware from "middlewares/whitelistUserMiddleware";
import axios from "axios";
import Enums from "enums";

const { DISCORD_NODEJS, NEXT_PUBLIC_WEBSITE_HOST, NODEJS_SECRET, NEXT_PUBLIC_ORIGIN_HOST } =
    process.env;

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
                        a. if it is <= 4

                        b. if it is >= 5
                */
                console.log(`** Checking if proper wallet ${wallet} is claiming the reward **`);

                console.log(`** Assure this reward exists and not redeemed **`);



                res.status(200).json({ message: "ok" });
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default whitelistUserMiddleware(shellRedeemRollAllAPI);
