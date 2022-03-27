/*
  Warnings:

  - You are about to drop the column `userId` on the `PendingReward` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Reward` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[wallet,rewardTypeId,tokens,generatedURL]` on the table `PendingReward` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "PendingReward" DROP CONSTRAINT "PendingReward_userId_fkey";

-- DropForeignKey
ALTER TABLE "Reward" DROP CONSTRAINT "Reward_userId_fkey";

-- DropIndex
DROP INDEX "PendingReward_wallet_rewardTypeId_generatedURL_tokens_key";

-- AlterTable
ALTER TABLE "PendingReward" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Reward" DROP COLUMN "userId";

-- CreateIndex
CREATE UNIQUE INDEX "PendingReward_wallet_rewardTypeId_tokens_generatedURL_key" ON "PendingReward"("wallet", "rewardTypeId", "tokens", "generatedURL");

-- AddForeignKey
ALTER TABLE "PendingReward" ADD CONSTRAINT "PendingReward_wallet_fkey" FOREIGN KEY ("wallet") REFERENCES "WhiteList"("wallet") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_wallet_fkey" FOREIGN KEY ("wallet") REFERENCES "WhiteList"("wallet") ON DELETE CASCADE ON UPDATE CASCADE;
