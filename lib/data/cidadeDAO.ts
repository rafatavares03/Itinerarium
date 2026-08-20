import { Prisma } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma"

type City = {
  id: number,
  nome: string,
  uf: string,
  geometria: object
}

export async function createCity(city: City) {
  return await prisma.$executeRaw`
    INSERT INTO cidade(id, nome, uf, geometria)
    VALUES (${city.id}, ${city.nome}, ${city.uf}, ST_Multi(ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(city.geometria)}), 4674)))
  `;
}

export async function getCidades(dados: {
  nome?: string,
  quantidade: number,
  pagina?: number
}) {
  const where:Prisma.CidadeWhereInput = {};
  const pagina = dados.pagina ?? 1;
  const skip = (pagina - 1) * dados.quantidade;
  const orderBy:Prisma.CidadeOrderByWithRelationInput[] = []

  if(dados.nome && dados.nome.trim().length > 0) {
    where.nome = {
      contains: dados.nome,
      mode: "insensitive"
    }
  } else {
    orderBy.push({
      nome: "asc"
    })
  }

  return await prisma.cidade.findMany({
    select: {
      id: true,
      nome: true,
      uf: true
    },
    where,
    orderBy,
    take: dados.quantidade,
    skip
  })
}