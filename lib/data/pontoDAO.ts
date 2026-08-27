import prisma from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { Ponto } from "@/types/ponto";

export async function savePoints(pontos: Ponto[]) {
  const pontosExistentes = pontos.filter(
    (ponto) => ponto.id !== undefined
  );

  const pontosNovos = pontos.filter(
    (ponto) => ponto.id === undefined
  );

  if (pontosExistentes.length > 0) {
    const valoresExistentes = pontosExistentes.map((ponto) => Prisma.sql`
      (
        ${ponto.id},
        ${ponto.endereco ?? null},
        ${ponto.cidade_id},
        ST_SetSRID(
          ST_MakePoint(
            ${ponto.coordenada[0]},
            ${ponto.coordenada[1]}
          ),
          4674
        )
      )
    `);

    await prisma.$executeRaw`
      INSERT INTO ponto (id, endereco, cidade, coordenada)
      VALUES ${Prisma.join(valoresExistentes)}
      ON CONFLICT (id)
      DO UPDATE SET
        endereco = EXCLUDED.endereco,
        cidade = EXCLUDED.cidade,
        coordenada = EXCLUDED.coordenada
    `;
  }

  if (pontosNovos.length > 0) {
    const valoresNovos = pontosNovos.map((ponto) => Prisma.sql`
      (
        ${ponto.endereco ?? null},
        ${ponto.cidade_id},
        ST_SetSRID(
          ST_MakePoint(
            ${ponto.coordenada[0]},
            ${ponto.coordenada[1]}
          ),
          4674
        )
      )
    `);

    await prisma.$executeRaw`
      INSERT INTO ponto (endereco, cidade, coordenada)
      VALUES ${Prisma.join(valoresNovos)}
    `;
  }
}