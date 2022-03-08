/*
  Warnings:

  - Added the required column `headpieces` to the `Anomuras` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Anomuras" ADD COLUMN     "headpieces" TEXT DEFAULT E'null';
