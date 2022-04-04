/*
  Warnings:

  - You are about to drop the column `followAccount` on the `Quest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Quest" DROP COLUMN IF EXISTS "followAccount",
ADD COLUMN   IF NOT EXISTS  "extendedQuestData" JSONB;
