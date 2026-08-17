-- CreateTable
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE "cidade" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "geometria" geometry(MultiPolygon, 4674),

    CONSTRAINT "cidade_pkey" PRIMARY KEY ("id")
);
