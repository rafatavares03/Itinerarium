import prisma from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { Ponto } from "@/types/ponto";

type PontoQuery = {
  id: number,
  logradouro: string,
  numero: string,
  cidade: number,
  longitude: number,
  latitude: number
}

export async function savePoints(pontos: Ponto[]) {
  const pontosExistentes = pontos.filter(
    (ponto) => ponto.id !== undefined
  );

  const pontosNovos = pontos.filter(
    (ponto) => ponto.id === undefined
  );

  const pontosSalvos: Ponto[] = []

  if (pontosExistentes.length > 0) {
    const valoresExistentes = pontosExistentes.map((ponto) => Prisma.sql`
      (
        ${ponto.id},
        ${ponto.logradouro},
        ${ponto.numero}
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

    let res = await prisma.$queryRaw<PontoQuery[]>`
      INSERT INTO ponto (id, logradouro, numero, cidade, coordenada)
      VALUES ${Prisma.join(valoresExistentes)}
      ON CONFLICT (id)
      DO UPDATE SET
        logradouro = EXCLUDED.logradouro,
        numero = EXCLUDED.numero,
        cidade = EXCLUDED.cidade,
        coordenada = EXCLUDED.coordenada
      RETURNING id, logradouro, numero, cidade, ST_X(coordenada) as longitude, ST_Y(coordenada) as latitude
    `;

    let resFormatado: Ponto[] = res.map((ponto) => {
    return {
      id: ponto.id,
      logradouro: ponto.logradouro,
      numero: ponto.numero,
      cidade_id: ponto.cidade,
      coordenada: [ponto.longitude, ponto.latitude]
    }
  })
    pontosSalvos.push(...resFormatado);
  }

  if (pontosNovos.length > 0) {
    const valoresNovos = pontosNovos.map((ponto) => Prisma.sql`
      (
        ${ponto.logradouro},
        ${ponto.numero},
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

    let res = await prisma.$queryRaw<PontoQuery[]>`
      INSERT INTO ponto (logradouro, numero, cidade, coordenada)
      VALUES ${Prisma.join(valoresNovos)}
      RETURNING id, cidade, logradouro, numero, ST_X(coordenada) as longitude, ST_Y(coordenada) as latitude
    `;

    let resFormatado: Ponto[] = res.map((ponto) => ({
      id: ponto.id,
      cidade_id: ponto.cidade,
      logradouro: ponto.logradouro,
      numero: ponto.numero,
      coordenada: [ponto.longitude, ponto.latitude]
    }));

    pontosSalvos.push(...resFormatado);
  }

  return pontosSalvos;
}

export async function deletePoints(pontos: Ponto[]) {
  if(!pontos) return;
  const ids = pontos
                .map(ponto => ponto.id)
                .filter((id): id is number => id !== undefined);

  return await prisma.ponto.deleteMany({
    where: {
      id: {
        in: ids
      }
    }
  })
}