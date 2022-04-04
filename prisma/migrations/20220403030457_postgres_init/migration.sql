/*
  Warnings:

  - You are about to drop the column `rewardId` on the `UserQuest` table. All the data in the column will be lost.
  - Added the required column `createdAt` to the `UserQuest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `UserQuest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserQuest" DROP CONSTRAINT "UserQuest_rewardId_fkey";

-- AlterTable
ALTER TABLE "UserQuest" DROP COLUMN "rewardId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "rewardedQty" INTEGER,
ADD COLUMN     "rewardedTypeId" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "UserQuest" ADD CONSTRAINT "UserQuest_rewardedTypeId_fkey" FOREIGN KEY ("rewardedTypeId") REFERENCES "RewardType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
