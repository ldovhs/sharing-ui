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
