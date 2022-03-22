/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `WhiteList` will be added. If there are existing duplicate values, this will fail.
  - Made the column `headpieces` on table `Anomuras` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `twitter` to the `WhiteList` table without a default value. This is not possible if the table is not empty.
  - The required column `userId` was added to the `WhiteList` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Anomuras" ALTER COLUMN "headpieces" SET NOT NULL;

-- AlterTable
ALTER TABLE "WhiteList" ADD COLUMN     "twitter" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Reward" (
    "id" SERIAL NOT NULL,
    "tokens" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "rewardTypeId" INTEGER NOT NULL,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewardType" (
    "id" SERIAL NOT NULL,
    "reward" TEXT NOT NULL,

    CONSTRAINT "RewardType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WhiteList_userId_key" ON "WhiteList"("userId");

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "WhiteList"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_rewardTypeId_fkey" FOREIGN KEY ("rewardTypeId") REFERENCES "RewardType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
