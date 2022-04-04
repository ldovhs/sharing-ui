/*
  Warnings:

  - A unique constraint covering the columns `[questId]` on the table `Quest` will be added. If there are existing duplicate values, this will fail.
  - The required column `questId` was added to the `Quest` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Quest" ADD COLUMN IF NOT EXIST "questId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "UserQuest" (
    "id" SERIAL NOT NULL,
    "wallet" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "rewardId" INTEGER NOT NULL,
    "extendedUserQuestData" JSONB,

    CONSTRAINT "UserQuest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserQuest_wallet_questId_key" ON "UserQuest"("wallet", "questId");

-- CreateIndex
CREATE UNIQUE INDEX "Quest_questId_key" ON "Quest"("questId");

-- AddForeignKey
ALTER TABLE "UserQuest" ADD CONSTRAINT "UserQuest_wallet_fkey" FOREIGN KEY ("wallet") REFERENCES "WhiteList"("wallet") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuest" ADD CONSTRAINT "UserQuest_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "Reward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserQuest" ADD CONSTRAINT "UserQuest_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("questId") ON DELETE RESTRICT ON UPDATE CASCADE;
