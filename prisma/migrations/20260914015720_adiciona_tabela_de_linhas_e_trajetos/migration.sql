-- CreateTable
CREATE TABLE "linha" (
    "id" SERIAL NOT NULL,
    "codigo" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "cidade" INTEGER NOT NULL,

    CONSTRAINT "linha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trajeto" (
    "id" SERIAL NOT NULL,
    "ativo" BOOLEAN NOT NULL,
    "vigencia" TIMESTAMP(3),
    "linha" INTEGER NOT NULL,
    "geometria" geometry(LineString, 4674),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trajeto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ponto_trajeto" (
    "id" SERIAL NOT NULL,
    "ordem" INTEGER NOT NULL,
    "final" BOOLEAN NOT NULL,
    "ponto" INTEGER NOT NULL,
    "trajeto" INTEGER NOT NULL,

    CONSTRAINT "ponto_trajeto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "linha" ADD CONSTRAINT "linha_cidade_fkey" FOREIGN KEY ("cidade") REFERENCES "cidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trajeto" ADD CONSTRAINT "trajeto_linha_fkey" FOREIGN KEY ("linha") REFERENCES "linha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ponto_trajeto" ADD CONSTRAINT "ponto_trajeto_ponto_fkey" FOREIGN KEY ("ponto") REFERENCES "ponto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ponto_trajeto" ADD CONSTRAINT "ponto_trajeto_trajeto_fkey" FOREIGN KEY ("trajeto") REFERENCES "trajeto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
