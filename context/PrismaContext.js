import { PrismaClient } from "@prisma/client";

export const prisma =
    global.prisma ||
    new PrismaClient({
        errorFormat: "pretty",
        log: [
            { level: "warn", emit: "event" },
            { level: "info", emit: "event" },
            { level: "error", emit: "event" },
        ],
    });

prisma.$on("warn", (e) => {
    //console.log(e);
});

prisma.$on("error", (e) => {
    console.log("on prisma error");
    console.log(e);
});

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
