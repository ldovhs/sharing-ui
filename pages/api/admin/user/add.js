import { prisma } from "@context/PrismaContext";
import adminMiddleware from "@middlewares/adminMiddleware";
const ROUTE = "/api/admin/user/add";

const whitelistUserAddAPI = async (req, res) => {
    const { method } = req;

    switch (method) {
        case "POST":
            try {
                console.log(`**Add New User**`);
                const { discordId, discordUserDiscriminator, wallet, twitterId, twitterUserName } =
                    req.body;

                let updateCondition = {};

                if (discordId.trim().length > 0) {
                    updateCondition = { ...updateCondition, discordId };
                }
                if (discordUserDiscriminator.trim().length > 0) {
                    updateCondition = { ...updateCondition, discordUserDiscriminator };
                }
                if (twitterId.trim().length > 0) {
                    updateCondition = { ...updateCondition, twitterId };
                }
                if (twitterUserName.trim().length > 0) {
                    updateCondition = { ...updateCondition, twitterUserName };
                }

                const user = await prisma.whiteList.upsert({
                    where: { wallet },
                    update: updateCondition,
                    create: {
                        wallet,
                        discordId,
                        discordUserDiscriminator,
                        twitterId,
                        twitterUserName,
                    },
                });

                res.status(200).json(user);
            } catch (error) {
                return res.status(200).json({ isError: true, message: error.message });
            }

            break;
        default:
            res.setHeader("Allow", ["POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};
export default adminMiddleware(whitelistUserAddAPI);
