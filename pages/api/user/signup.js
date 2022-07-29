import { utils } from "ethers";
import { addNewUser, getWhiteListUserByWallet } from "repositories/user";

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
                await trackRequest(req)
                // await checkRequest(req, res)

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

const checkRequest = async (req, res) => {
    const { url, headers } = req;

    const forwarded = req.headers["x-forwarded-for"]
    const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress

    let sameRequest = await prisma.logRegister.findMany({
        where: {
            ip
        }
    })
    console.log(sameRequest)
    // if (sameRequest.length > 4) {
    //     return res.status(200).json({ isError: true, message: "Duplicate Sign Up" });
    // }
}
