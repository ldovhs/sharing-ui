/*
  Warnings:

  - A unique constraint covering the columns `[wallet]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Admin_wallet_key" ON "Admin"("wallet");
