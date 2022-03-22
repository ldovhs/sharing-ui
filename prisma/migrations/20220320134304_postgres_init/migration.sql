/*
  Warnings:

  - You are about to drop the column `discordID` on the `PendingReward` table. All the data in the column will be lost.
  - You are about to drop the column `discordID` on the `Reward` table. All the data in the column will be lost.
  - You are about to drop the column `discordID` on the `WhiteList` table. All the data in the column will be lost.
  - Added the required column `discordId` to the `PendingReward` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discordId` to the `Reward` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PendingReward" DROP COLUMN "discordID",
ADD COLUMN     "discordId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Reward" DROP COLUMN "discordID",
ADD COLUMN     "discordId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WhiteList" DROP COLUMN "discordID",
ADD COLUMN     "discordId" TEXT NOT NULL DEFAULT E'',
ALTER COLUMN "numberOfInvites" SET DEFAULT 0,
ALTER COLUMN "twitter" SET DEFAULT E'';
