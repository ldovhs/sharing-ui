-- CreateTable
CREATE TABLE "WhiteList" (
    "id" SERIAL NOT NULL,
    "wallet" TEXT NOT NULL,
    "twitterId" TEXT DEFAULT E'',
    "twitterUserName" TEXT DEFAULT E'',
    "userId" TEXT NOT NULL,
    "discordId" TEXT DEFAULT E'',
    "discordUserDiscriminator" TEXT DEFAULT E'',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nonce" TEXT,

    CONSTRAINT "WhiteList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PendingReward" (
    "id" SERIAL NOT NULL,
    "wallet" TEXT NOT NULL,
    "generatedURL" TEXT NOT NULL,
    "isClaimed" BOOLEAN NOT NULL DEFAULT false,
    "rewardTypeId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PendingReward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reward" (
    "id" SERIAL NOT NULL,
    "rewardTypeId" INTEGER NOT NULL,
    "wallet" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewardType" (
    "id" SERIAL NOT NULL,
    "reward" TEXT NOT NULL,

    CONSTRAINT "RewardType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "QuestType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserQuest" (
    "id" SERIAL NOT NULL,
    "wallet" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "extendedUserQuestData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rewardedQty" INTEGER,
    "rewardedTypeId" INTEGER,

    CONSTRAINT "UserQuest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quest" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "completedText" TEXT NOT NULL,
    "rewardTypeId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT DEFAULT E'',
    "extendedQuestData" JSONB,
    "questId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "questTypeId" INTEGER NOT NULL,

    CONSTRAINT "Quest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "wallet" TEXT NOT NULL,
    "nonce" TEXT,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
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
    "image" TEXT NOT NULL DEFAULT E'',
    "playersWallet" TEXT,
    "headpieces" TEXT DEFAULT E'',

    CONSTRAINT "Anomuras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Players" (
    "wallet" TEXT NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "Players_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WhiteList_wallet_key" ON "WhiteList"("wallet");

-- CreateIndex
CREATE UNIQUE INDEX "WhiteList_userId_key" ON "WhiteList"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PendingReward_wallet_rewardTypeId_generatedURL_key" ON "PendingReward"("wallet", "rewardTypeId", "generatedURL");

-- CreateIndex
CREATE UNIQUE INDEX "Reward_wallet_rewardTypeId_key" ON "Reward"("wallet", "rewardTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "QuestType_name_key" ON "QuestType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserQuest_wallet_questId_key" ON "UserQuest"("wallet", "questId");

-- CreateIndex
CREATE UNIQUE INDEX "Quest_questId_key" ON "Quest"("questId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_wallet_key" ON "Admin"("wallet");

-- CreateIndex
CREATE UNIQUE INDEX "Anomuras_crabId_key" ON "Anomuras"("crabId");

-- CreateIndex
CREATE UNIQUE INDEX "Players_wallet_key" ON "Players"("wallet");

-- AddForeignKey
ALTER TABLE "PendingReward" ADD CONSTRAINT "PendingReward_wallet_fkey" FOREIGN KEY ("wallet") REFERENCES "WhiteList"("wallet") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingReward" ADD CONSTRAINT "PendingReward_rewardTypeId_fkey" FOREIGN KEY ("rewardTypeId") REFERENCES "RewardType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_wallet_fkey" FOREIGN KEY ("wallet") REFERENCES "WhiteList"("wallet") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_rewardTypeId_fkey" FOREIGN KEY ("rewardTypeId") REFERENCES "RewardType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuest" ADD CONSTRAINT "UserQuest_wallet_fkey" FOREIGN KEY ("wallet") REFERENCES "WhiteList"("wallet") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuest" ADD CONSTRAINT "UserQuest_rewardedTypeId_fkey" FOREIGN KEY ("rewardedTypeId") REFERENCES "RewardType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuest" ADD CONSTRAINT "UserQuest_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("questId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_rewardTypeId_fkey" FOREIGN KEY ("rewardTypeId") REFERENCES "RewardType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_questTypeId_fkey" FOREIGN KEY ("questTypeId") REFERENCES "QuestType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anomuras" ADD CONSTRAINT "Anomuras_playersWallet_fkey" FOREIGN KEY ("playersWallet") REFERENCES "Players"("wallet") ON DELETE SET NULL ON UPDATE CASCADE;
