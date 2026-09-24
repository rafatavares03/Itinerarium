import prisma from "@/lib/prisma";
import { LinhaBasic } from "@/types/linha";

export async function saveLine(data: {
  id?: number;
  code: number;
  name: string;
  city: number;
}) {
  return await prisma.linha.upsert({
    where: {
      id: data.id ?? -1,
    },
    update: {
      codigo: data.code,
      nome: data.name,
      cidade_id: data.city,
    },
    create: {
      codigo: data.code,
      nome: data.name,
      cidade_id: data.city,
    },
  });
}

export async function updateLine(line: LinhaBasic) {
  const busLine = await prisma.linha.update({
    where: {
      id: line.id
    },
    data: {
      codigo: line.codigo,
      nome: line.nome
    }
  });

  return busLine;
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
          { codigo: (Number.isNaN(parseInt(search))) ? -1 : parseInt(search) },
          { nome: { contains: search, mode: "insensitive" } }
        ]
      }),
    },
    ...((page && amount) && {
      skip: (page - 1) * amount,
      take: amount
    })
  })

  return busLines;
}