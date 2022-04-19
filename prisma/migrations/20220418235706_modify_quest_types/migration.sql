/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `QuestType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "QuestType_type_key" ON "QuestType"("type");
