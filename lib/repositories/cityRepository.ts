import { Prisma } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma"
import { CidadeDetails } from "@/types/cidade";

type City = {
  id: number,
  nome: string,
  uf: string,
  geometria?: object,
  enquadramento?: [
    [minLat: number, minLong: number],
    [maxLat: number, maxLong: number]
  ]
}

type CityQuery = {
  id: number;
  nome: string;
  uf: string;
  minLat: number;
  minLong: number;
  maxLat: number;
  maxLong: number;
}

export async function saveCity(city: City) {
  const enquadramento = city.enquadramento
  ? Prisma.sql`
      , enquadramento_mapa = ST_MakeBox2d(
        ST_SetSRID(ST_Point(${city.enquadramento[0][1]}, ${city.enquadramento[0][0]}), 4674),
        SR_SetSRID(ST_Point(${city.enquadramento[1][1]}, ${city.enquadramento[1][0]}), 4674)
      )::box2d
    `
  : Prisma.empty;
  const res = await prisma.$queryRaw<CityQuery[]>`
    INSERT INTO cidade(id, nome, uf, geometria, enquadramento_mapa)
    VALUES (
      ${city.id}, 
      ${city.nome}, 
      ${city.uf}, 
      ST_Multi(ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(city.geometria)}), 4674)),
      ST_Envelope(ST_Multi(ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(city.geometria)}), 4674)))::box2d
    )
    ON CONFLICT (id) DO UPDATE
    SET nome = ${city.nome}, 
      uf = ${city.uf}, 
      geometria = ST_Multi(ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(city.geometria)}), 4674))
      ${enquadramento}
    RETURNING
      id,
      nome,
      uf,
      ST_YMin(enquadramento_mapa) AS "minLat",
      ST_XMin(enquadramento_mapa) AS "minLong",
      ST_YMax(enquadramento_mapa) AS "maxLat",
      ST_XMax(enquadramento_mapa) AS "maxLong"
  `;
  if(!res) return false;

  return res[0];
}

export async function updateCityBounds(
  id: number,
  enquadramento: [[number, number], [number, number]]
) {
  const res = await prisma.$queryRaw<CityQuery[]>`
    UPDATE cidade
    SET enquadramento_mapa = ST_MakeBox2D(
      ST_Point(
        ${enquadramento[0][1]},
        ${enquadramento[0][0]}
      ),
      ST_Point(
        ${enquadramento[1][1]},
        ${enquadramento[1][0]}
      )
    )::box2d
    WHERE id = ${id}
    RETURNING
      id,
      nome,
      uf,
      ST_YMin(enquadramento_mapa) AS "minLat",
      ST_XMin(enquadramento_mapa) AS "minLong",
      ST_YMax(enquadramento_mapa) AS "maxLat",
      ST_XMax(enquadramento_mapa) AS "maxLong"
  `;

  if (res.length === 0) {
    return null;
  }

  return res[0];
}

export async function getById(id: number) {
  const cidade = await prisma.$queryRaw<CityQuery[]>`
    SELECT 
      id, 
      nome, 
      uf, 
      ST_YMin(enquadramento_mapa) AS "minLat",
      ST_XMin(enquadramento_mapa) AS "minLong",
      ST_YMax(enquadramento_mapa) AS "maxLat",
      ST_XMax(enquadramento_mapa) AS "maxLong"
    FROM cidade 
    WHERE id = ${id}
  `
  if(!cidade[0]) return null;

  const cidadeFormatada:CidadeDetails[] = cidade.map((cidade) => {
    return {
      id: cidade.id,
      nome: cidade.nome,
      uf: cidade.uf,
      enquadramento: [
        [cidade.minLat, cidade.maxLong],
        [cidade.maxLat, cidade.maxLong]
      ] as CidadeDetails["enquadramento"]
    }
  })

  return {
    city: cidadeFormatada[0],
  }
}

export async function getCidades(dados: {
  nome?: string,
  quantidade: number,
  pagina?: number
}) {
  const pagina = dados.pagina ?? 1;
  const skip = (pagina - 1) * dados.quantidade;

  const cidades = await prisma.$queryRaw<CityQuery[]>`
    SELECT
      id,
      nome,
      uf,
      ST_YMin(enquadramento_mapa) AS "minLat",
      ST_XMin(enquadramento_mapa) AS "minLong",
      ST_YMax(enquadramento_mapa) AS "maxLat",
      ST_XMax(enquadramento_mapa) AS "maxLong"
    FROM cidade
    ${
      dados.nome && dados.nome.trim().length > 0
        ? Prisma.sql`WHERE nome ILIKE ${`%${dados.nome}%`}`
        : Prisma.empty
    }
    ORDER BY nome ASC
    LIMIT ${dados.quantidade}
    OFFSET ${skip}
  `;

  return cidades.map((cidade) => {
    return {
      id: cidade.id,
      nome: cidade.nome,
      uf: cidade.uf,
      enquadramento: [
        [cidade.minLat, cidade.maxLong],
        [cidade.maxLat, cidade.maxLong]
      ] as CidadeDetails["enquadramento"]
    }
  });
}