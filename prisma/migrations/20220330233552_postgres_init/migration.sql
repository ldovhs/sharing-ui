/*
  Warnings:

  - You are about to drop the column `tokens` on the `PendingReward` table. All the data in the column will be lost.
  - You are about to drop the column `tokens` on the `Reward` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[wallet,rewardTypeId,generatedURL]` on the table `PendingReward` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "PendingReward_wallet_rewardTypeId_generatedURL_tokens_key";

-- AlterTable
ALTER TABLE "PendingReward" DROP COLUMN "tokens",
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Reward" DROP COLUMN "tokens",
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Quest" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "completedText" TEXT NOT NULL,
    "rewardTypeId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "followAccount" TEXT DEFAULT E'null',

    CONSTRAINT "Quest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PendingReward_wallet_rewardTypeId_generatedURL_key" ON "PendingReward"("wallet", "rewardTypeId", "generatedURL");

-- AddForeignKey
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_rewardTypeId_fkey" FOREIGN KEY ("rewardTypeId") REFERENCES "RewardType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
