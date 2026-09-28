/*
  Warnings:

  - You are about to drop the column `nome` on the `linha` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cidade,codigo]` on the table `linha` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `destino` to the `linha` table without a default value. This is not possible if the table is not empty.
  - Added the required column `origem` to the `linha` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ida` to the `trajeto` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ponto_trajeto" DROP CONSTRAINT "ponto_trajeto_trajeto_fkey";

-- DropIndex
DROP INDEX "linha_codigo_key";

-- AlterTable
ALTER TABLE "linha" DROP COLUMN "nome",
ADD COLUMN     "destino" TEXT NOT NULL,
ADD COLUMN     "origem" TEXT NOT NULL,
ALTER COLUMN "codigo" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "trajeto" ADD COLUMN     "ida" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "horario" (
    "hora" TIMESTAMP(3) NOT NULL,
    "ida" BOOLEAN NOT NULL,
    "linha" INTEGER NOT NULL,

    CONSTRAINT "horario_pkey" PRIMARY KEY ("hora","ida","linha")
);

-- CreateIndex
CREATE UNIQUE INDEX "linha_cidade_codigo_key" ON "linha"("cidade", "codigo");

-- AddForeignKey
ALTER TABLE "ponto_trajeto" ADD CONSTRAINT "ponto_trajeto_trajeto_fkey" FOREIGN KEY ("trajeto") REFERENCES "trajeto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horario" ADD CONSTRAINT "horario_linha_fkey" FOREIGN KEY ("linha") REFERENCES "linha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
