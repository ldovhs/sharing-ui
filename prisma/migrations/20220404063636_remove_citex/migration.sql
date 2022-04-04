/*
  Warnings:

  - The primary key for the `Players` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[wallet]` on the table `Players` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Players" DROP CONSTRAINT "Players_pkey" CASCADE,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Players_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Players_wallet_key" ON "Players"("wallet");
