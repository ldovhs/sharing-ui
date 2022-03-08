-- CreateTable
CREATE TABLE "WhiteList" (
    "id" SERIAL NOT NULL,
    "wallet" TEXT NOT NULL,
    "discordID" TEXT NOT NULL,
    "numberOfInvites" INTEGER NOT NULL,

    CONSTRAINT "WhiteList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anomuras" (
    "id" SERIAL NOT NULL,
    "owner" TEXT NOT NULL,
    "crabId" INTEGER NOT NULL,
    "background" TEXT NOT NULL,
    "legs" TEXT NOT NULL,
    "shell" TEXT NOT NULL,
    "claws" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT E'null',
    "playersWallet" TEXT,

    CONSTRAINT "Anomuras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Players" (
    "wallet" TEXT NOT NULL,

    CONSTRAINT "Players_pkey" PRIMARY KEY ("wallet")
);

-- AddForeignKey
ALTER TABLE "Anomuras" ADD CONSTRAINT "Anomuras_playersWallet_fkey" FOREIGN KEY ("playersWallet") REFERENCES "Players"("wallet") ON DELETE SET NULL ON UPDATE CASCADE;
