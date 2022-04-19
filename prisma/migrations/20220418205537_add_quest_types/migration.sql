/*
  Warnings:

  - You are about to drop the column `type` on the `Quest` table. All the data in the column will be lost.
  - Added the required column `questTypeId` to the `Quest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quest" DROP COLUMN "type",
ADD COLUMN     "questTypeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "WhiteList" ADD COLUMN     "nonce" TEXT;

-- CreateTable
CREATE TABLE "QuestType" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "QuestType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_questTypeId_fkey" FOREIGN KEY ("questTypeId") REFERENCES "QuestType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
