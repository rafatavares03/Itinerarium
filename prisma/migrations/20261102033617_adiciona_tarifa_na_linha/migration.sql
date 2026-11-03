/*
  Warnings:

  - Added the required column `tarifa` to the `linha` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "linha" ADD COLUMN     "tarifa" DECIMAL(10,2) NOT NULL;
