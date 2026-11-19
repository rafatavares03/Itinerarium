/*
  Warnings:

  - You are about to drop the column `usuario` on the `comentario` table. All the data in the column will be lost.
  - Added the required column `email` to the `comentario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comentario" DROP CONSTRAINT "comentario_usuario_fkey";

-- AlterTable
ALTER TABLE "comentario" DROP COLUMN "usuario",
ADD COLUMN     "email" TEXT NOT NULL;
