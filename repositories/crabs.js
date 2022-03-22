import { prisma } from "../context/PrismaContext";

export const getCrabById = async (crabId) => {
    return await prisma.anomuras.findFirst({
        where: {
            crabId,
        },
    });
};

export const getAllCrabs = async (crabId) => {
    return await prisma.anomuras.findMany({
        where: {
            crabId,
        },
    });
};

export const updateCrabById = async (crabData) => {
    const { crabId, image, body, legs, claws, shell, headpieces, background } = crabData;
    console.log("*****prisma update anomura image by id");
    return await prisma.anomuras.update({
        where: {
            id: crabId,
        },
        data: {
            image,
            // body,
            // legs,
            // claws,
            // shell,
            // headpieces,
            // background
        },
    });
};

export const createCrab = async (crabData) => {
    const { crabId, background, body, legs, claws, shell, image, headpieces } = crabData;
    return await prisma.anomuras.create({
        data: {
            crabId,
            owner: "0x123456",
            background,
            legs,
            shell,
            claws,
            body,
            image,
            headpieces,
        },
    });
};
