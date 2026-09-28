import prisma from "@/lib/prisma";
import { BusLineBasic } from "@/types/busLine";

export async function saveLine(data: {
  id?: number;
  code: string;
  origin: string,
  destination: string,
  city: number;
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
    },
    create: {
      codigo: data.code,
      origem: data.origin,
      destino: data.destination,
      cidade_id: data.city,
    },
  });
}

// export async function updateLine(line: BusLineBasic) {
//   const busLine = await prisma.linha.update({
//     where: {
//       id: line.id
//     },
//     data: {
//       codigo: line.codigo,
//       nome: line.nome
//     }
//   });

//   return busLine;
// }

export async function getLineById(id: number) {
  return await prisma.linha.findUnique({
    where: {
      id: id
    }
  })
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

  return busLines;
}