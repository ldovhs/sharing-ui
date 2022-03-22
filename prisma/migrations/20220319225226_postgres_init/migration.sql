/*
  Warnings:

  - A unique constraint covering the columns `[wallet,rewardTypeId,generatedURL,tokens]` on the table `PendingReward` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[wallet,rewardTypeId]` on the table `Reward` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "PendingReward_wallet_rewardTypeId_tokens_generatedURL_key";

-- DropIndex
DROP INDEX "Reward_wallet_rewardTypeId_tokens_key";

-- CreateIndex
CREATE UNIQUE INDEX "PendingReward_wallet_rewardTypeId_generatedURL_tokens_key" ON "PendingReward"("wallet", "rewardTypeId", "generatedURL", "tokens");

-- CreateIndex
CREATE UNIQUE INDEX "Reward_wallet_rewardTypeId_key" ON "Reward"("wallet", "rewardTypeId");
