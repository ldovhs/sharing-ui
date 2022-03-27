/*
  Warnings:

  - Added the required column `walletId` to the `PendingReward` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PendingReward" DROP CONSTRAINT "PendingReward_wallet_fkey";

-- AlterTable
ALTER TABLE "PendingReward" ADD COLUMN     "walletId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PendingReward" ADD CONSTRAINT "PendingReward_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "WhiteList"("wallet") ON DELETE CASCADE ON UPDATE CASCADE;
