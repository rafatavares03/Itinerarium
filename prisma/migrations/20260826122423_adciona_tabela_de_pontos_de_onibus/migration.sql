/*
  Warnings:

  - Made the column `geometria` on table `cidade` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "cidade" ALTER COLUMN "geometria" SET NOT NULL;

-- CreateTable
CREATE TABLE "ponto" (
    "id" SERIAL NOT NULL,
    "endereco" TEXT NOT NULL,
    "cidade" INTEGER NOT NULL,
    "coordenada" geometry(Point, 4674) NOT NULL,

    CONSTRAINT "ponto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ponto" ADD CONSTRAINT "ponto_cidade_fkey" FOREIGN KEY ("cidade") REFERENCES "cidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
