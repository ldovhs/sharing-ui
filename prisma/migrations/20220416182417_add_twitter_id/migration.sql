/*
  Warnings:

  - You are about to drop the column `twitter` on the `WhiteList` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WhiteList" DROP COLUMN "twitter",
ADD COLUMN     "twitterId" TEXT DEFAULT E'',
ADD COLUMN     "twitterUserName" TEXT DEFAULT E'';
