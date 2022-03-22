/*
  Warnings:

  - A unique constraint covering the columns `[generatedURL]` on the table `PendingReward` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PendingReward_generatedURL_key" ON "PendingReward"("generatedURL");
