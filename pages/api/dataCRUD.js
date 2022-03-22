import { prisma } from "@context/PrismaContext";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const whiteListData = JSON.parse(req.body);

    const savedWhiteList = await prisma.whiteList.create({
        data: {
            wallet: whiteListData.wallet,
            discordId: whiteListData.discordId,
        },
    });
    console.log(whiteListData);
    res.json(savedWhiteList);
}
