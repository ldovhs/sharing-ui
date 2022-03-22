/*
  Warnings:

  - Added the required column `discordID` to the `Reward` table without a default value. This is not possible if the table is not empty.
  - Added the required column `twitter` to the `Reward` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wallet` to the `Reward` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reward" ADD COLUMN     "discordID" TEXT NOT NULL,
ADD COLUMN     "twitter" TEXT NOT NULL,
ADD COLUMN     "wallet" TEXT NOT NULL;
