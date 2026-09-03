-- CreateTable
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE "cidade" (
    "id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "geometria" geometry(MultiPolygon, 4674) NOT NULL,
    "enquadramento_mapa" box2d NOT NULL,

    CONSTRAINT "cidade_pkey" PRIMARY KEY ("id")
);
