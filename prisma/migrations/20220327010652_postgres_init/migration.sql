/*
  Warnings:

  - You are about to drop the column `walletId` on the `PendingReward` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PendingReward" DROP CONSTRAINT "PendingReward_walletId_fkey";

-- AlterTable
ALTER TABLE "PendingReward" DROP COLUMN "walletId";

-- AddForeignKey
ALTER TABLE "PendingReward" ADD CONSTRAINT "PendingReward_wallet_fkey" FOREIGN KEY ("wallet") REFERENCES "WhiteList"("wallet") ON DELETE CASCADE ON UPDATE CASCADE;
