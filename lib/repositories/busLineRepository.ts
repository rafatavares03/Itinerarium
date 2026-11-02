import prisma from "@/lib/prisma";
import { BusLineBasic } from "@/types/busLine";

export async function saveLine(data: {
  id?: number;
  code: string;
  origin: string;
  destination: string;
  city: number;
  fare: string;
}) {
  return await prisma.linha.upsert({
    where: {
      id: data.id ?? -1,
    },
    update: {
      codigo: data.code,
      origem: data.origin,
      destino: data.destination,
      cidade_id: data.city,
      tarifa: data.fare
    },
    create: {
      codigo: data.code,
      origem: data.origin,
      destino: data.destination,
      cidade_id: data.city,
      tarifa: data.fare
    },
  });
}

export async function getLineById(id: number) {
  const query = await prisma.linha.findUnique({
    where: {
      id: id
    }
  })
  if(!query) return query;
  return {
    ...query,
    tarifa: query.tarifa.toString()
  }
}

export async function getLine(cidade: number, params: {
  amount?: number,
  page?: number,
  search?: string
}) {
  const {
    search,
    page,
    amount
  } = params;
  const busLines = await prisma.linha.findMany({
    where: {
      cidade_id: cidade,
      ...(search && {
        OR: [
          { codigo: {contains: search, mode: "insensitive"} },
          { origem: {contains: search, mode: "insensitive"} },
          { destino: { contains: search, mode: "insensitive" } }
        ]
      }),
    },
    ...((page && amount) && {
      skip: (page - 1) * amount,
      take: amount
    }),
    orderBy: {
      codigo: "asc"
    }
  })

  return busLines.map(data => ({
    ...data,
    tarifa: data.tarifa.toString()
  }));
}