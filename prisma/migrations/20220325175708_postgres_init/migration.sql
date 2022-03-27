/*
  Warnings:

  - You are about to drop the column `discordId` on the `PendingReward` table. All the data in the column will be lost.
  - You are about to drop the column `twitter` on the `PendingReward` table. All the data in the column will be lost.
  - You are about to drop the column `discordId` on the `Reward` table. All the data in the column will be lost.
  - You are about to drop the column `twitter` on the `Reward` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[wallet]` on the table `WhiteList` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PendingReward" DROP COLUMN "discordId",
DROP COLUMN "twitter";

-- AlterTable
ALTER TABLE "Reward" DROP COLUMN "discordId",
DROP COLUMN "twitter";

-- CreateIndex
CREATE UNIQUE INDEX "WhiteList_wallet_key" ON "WhiteList"("wallet");
