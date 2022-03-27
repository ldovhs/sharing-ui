/*
  Warnings:

  - A unique constraint covering the columns `[discordId]` on the table `WhiteList` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WhiteList_discordId_key" ON "WhiteList"("discordId");
