/*
  Warnings:

  - A unique constraint covering the columns `[wallet,rewardTypeId,tokens,generatedURL]` on the table `PendingReward` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[wallet,rewardTypeId,tokens]` on the table `Reward` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "PendingReward_generatedURL_key";

-- CreateIndex
CREATE UNIQUE INDEX "PendingReward_wallet_rewardTypeId_tokens_generatedURL_key" ON "PendingReward"("wallet", "rewardTypeId", "tokens", "generatedURL");

-- CreateIndex
CREATE UNIQUE INDEX "Reward_wallet_rewardTypeId_tokens_key" ON "Reward"("wallet", "rewardTypeId", "tokens");
