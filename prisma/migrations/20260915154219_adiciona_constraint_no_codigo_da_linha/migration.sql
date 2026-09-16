/*
  Warnings:

  - A unique constraint covering the columns `[codigo]` on the table `linha` will be added. If there are existing duplicate values, this will fail.
  - Made the column `geometria` on table `trajeto` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "trajeto" ALTER COLUMN "geometria" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "linha_codigo_key" ON "linha"("codigo");
