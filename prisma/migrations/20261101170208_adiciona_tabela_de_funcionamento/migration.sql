/*
  Warnings:

  - The primary key for the `horario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `linha` on the `horario` table. All the data in the column will be lost.
  - Added the required column `funcionamento` to the `horario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "horario" DROP CONSTRAINT "horario_linha_fkey";

-- DropForeignKey
ALTER TABLE "trajeto" DROP CONSTRAINT "trajeto_linha_fkey";

-- AlterTable
ALTER TABLE "horario" DROP CONSTRAINT "horario_pkey",
DROP COLUMN "linha",
ADD COLUMN     "funcionamento" INTEGER NOT NULL,
ADD CONSTRAINT "horario_pkey" PRIMARY KEY ("funcionamento", "hora", "ida");

-- CreateTable
CREATE TABLE "funcionamento" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "linha" INTEGER NOT NULL,

    CONSTRAINT "funcionamento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "funcionamento_linha_nome_key" ON "funcionamento"("linha", "nome");

-- AddForeignKey
ALTER TABLE "trajeto" ADD CONSTRAINT "trajeto_linha_fkey" FOREIGN KEY ("linha") REFERENCES "linha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funcionamento" ADD CONSTRAINT "funcionamento_linha_fkey" FOREIGN KEY ("linha") REFERENCES "linha"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horario" ADD CONSTRAINT "horario_funcionamento_fkey" FOREIGN KEY ("funcionamento") REFERENCES "funcionamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;
