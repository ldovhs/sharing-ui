import { utils } from "ethers";
import { addNewUser, getWhiteListUserByWallet } from "repositories/user";
import { prisma } from "@context/PrismaContext";

export default async function whitelistSignUp(req, res) {
    const { method } = req;

    switch (method) {
        case "POST":
            try {
                console.log(`**Sign up new user**`);
                const { address, signature, secret } = req.body;
                if (!secret || secret !== process.env.NEXT_PUBLIC_API_SECRET) {
                    return res.status(200).json({ message: "no matching" });
                }
                let check = await checkRequest(req, res)
                if (check === false) {
                    return res.status(200).json({ isError: true, message: "Duplicate Sign Up" });
                }

                await trackRequest(req)

                if (!signature || !address) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "Missing user info for sign up." });
                }

                let wallet = utils.getAddress(address);
                let isValid = utils.isAddress(address);
                if (!wallet || !isValid) {
                    return res
                        .status(200)
                        .json({ isError: true, message: "The wallet address is not valid" });
                }

                const existingUser = await getWhiteListUserByWallet(wallet);
                if (existingUser) {
                    return res.status(200).json({ existingUser });
                }

                const newUser = await addNewUser(wallet);
                if (!newUser) {
                    return res.status(200).json({
                        isError: true,
                        message: "Cannot sign up new user. Please contact administrator!",
                    });
                }

                res.status(200).json(newUser);
            } catch (error) {
                console.log(error);
                return res.status(200).json({ isError: true, message: error.message });
            }
            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}

const trackRequest = async (req) => {
    const { url, headers } = req;

    const referer = headers['referer'];
    const userAgent = headers['user-agent'];
    const wallet = utils.getAddress(req.body.address);
    const forwarded = req.headers["x-forwarded-for"]
    const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress

    await prisma.logRegister.create({
        data: {
            url,
            referer,
            userAgent,
            wallet,
            ip
        }
    })
}

const blockedUserAgentArr = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
    //"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
    //"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
]

const blockIPArr = [
    "103.152.220.44"
]

const checkRequest = async (req, res) => {
    const { url, headers } = req;

    const forwarded = req.headers["x-forwarded-for"]
    const userAgent = headers['user-agent'];

    if (blockedUserAgentArr.includes(userAgent)) {
        console.log("found blocked user agent test")
        return false
    }
    const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress

    if (blockIPArr.includes(ip)) {
        console.log("found blocked ip test")
        return false
    }
    let sameRequest = await prisma.logRegister.findMany({
        where: {
            ip
        }
    })

    if (sameRequest.length > 2) {
        return false
    }
    else return true
}
