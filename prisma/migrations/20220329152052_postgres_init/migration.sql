/*
  Warnings:

  - A unique constraint covering the columns `[wallet,discordId,twitter]` on the table `WhiteList` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "WhiteList_discordId_key";

-- CreateIndex
CREATE UNIQUE INDEX "WhiteList_wallet_discordId_twitter_key" ON "WhiteList"("wallet", "discordId", "twitter");
