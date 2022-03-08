/*
  Warnings:

  - A unique constraint covering the columns `[crabId]` on the table `Anomuras` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Anomuras_crabId_key" ON "Anomuras"("crabId");
