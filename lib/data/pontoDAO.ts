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

function sqlAdressFilter(address?: string) {
    const termos = address?.trim()
                          .split(/s+/)
                          .map((termo) => termo.replace(/[,.]g/, ""))
                          .filter(Boolean)
  const filter = termos?.length ?
                  Prisma.sql`
                    AND ${Prisma.join(
                      termos.map((termo) => Prisma.sql`
                          (
                            logradouro ILIKE ${`%${termo}%`} OR numero ILIKE ${`%${termo}%`}
                          )
                        `
                    ), 
                    " AND "
                    )}
                  ` :
                  Prisma.empty

  return filter;
}

export async function getPagesAmount(cidadeId: number, quantidade: number, endereco?: string) {
  const filter = sqlAdressFilter(endereco);
  const [{ total }] = await prisma.$queryRaw<{ total: bigint }[]>`
    SELECT COUNT(*) AS total
    FROM ponto
    WHERE cidade = ${cidadeId} ${filter}
  `;

  return {
    quantidadePaginas: Math.ceil(Number(total) / quantidade)
  }
}

export async function getPontos(
  cidadeId: number,
  quantidade: number,
  pagina: number,
  endereco?: string
) {
  const offset = (pagina - 1) * quantidade;
  const termos = endereco?.trim()
                          .split(/s+/)
                          .map((termo) => termo.replace(/[,.]g/, ""))
                          .filter(Boolean)
  const filtro = termos?.length ?
                  Prisma.sql`
                    AND ${Prisma.join(
                      termos.map((termo) => Prisma.sql`
                          (
                            logradouro ILIKE ${`%${termo}%`} OR numero ILIKE ${`%${termo}%`}
                          )
                        `
                    ), 
                    " AND "
                    )}
                  ` :
                  Prisma.empty

  const pontos = await prisma.$queryRaw<PontoQuery[]>`
    SELECT
      id,
      logradouro,
      numero,
      cidade,
      ST_X(coordenada) AS longitude,
      ST_Y(coordenada) AS latitude
    FROM ponto
    WHERE cidade = ${cidadeId} ${filtro}
    ORDER BY id
    LIMIT ${quantidade}
    OFFSET ${offset}
  `;

  const pontosFormatados: Ponto[] = pontos.map((ponto) => ({
    id: ponto.id,
    logradouro: ponto.logradouro,
    numero: ponto.numero,
    cidade_id: ponto.cidade,
    coordenada: [ponto.longitude, ponto.latitude]
  }));

  return {
    pontosFormatados
  };
}