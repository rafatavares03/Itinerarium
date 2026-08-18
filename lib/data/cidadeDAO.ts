import prisma from "@/lib/prisma"

type City = {
  nome: string,
  uf: string,
  geometria: object
}

export async function createCity(city: City) {
  return await prisma.$executeRaw`
    INSERT INTO cidade(nome, uf, geometria)
    VALUES (${city.nome}, ${city.uf}, ST_Multi(ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(city.geometria)}), 4674)))
  `;
}

export async function getByName(name: string) {
  return await prisma.cidade.findMany({
    where: {
      nome: {
        contains: name,
        mode: "insensitive"
      }
    }
  })
}