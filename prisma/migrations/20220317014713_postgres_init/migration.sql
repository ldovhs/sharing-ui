-- CreateTable
CREATE TABLE "PendingReward" (
    "id" SERIAL NOT NULL,
    "discordID" TEXT NOT NULL,
    "twitter" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,
    "tokens" INTEGER NOT NULL DEFAULT 0,
    "generatedURL" TEXT NOT NULL,
    "isClaimed" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "rewardTypeId" INTEGER NOT NULL,

    CONSTRAINT "PendingReward_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PendingReward" ADD CONSTRAINT "PendingReward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "WhiteList"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingReward" ADD CONSTRAINT "PendingReward_rewardTypeId_fkey" FOREIGN KEY ("rewardTypeId") REFERENCES "RewardType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
