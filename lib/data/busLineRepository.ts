import prisma from "@/lib/prisma";
import { LinhaBasic } from "@/types/linha";

export async function createLine(data: {
  codigo: number,
  nome: string,
  cidade_id: number
}) {
  const linha = await prisma.linha.create({
    data: {
      codigo: data.codigo,
      nome: data.nome,
      cidade_id: data.cidade_id
    }
  });

  return linha;
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
  quantidade?: number,
  pagina?: number,
  busca?: string
}) {
  const {
    busca,
    pagina,
    quantidade
  } = params;
  const busLines = await prisma.linha.findMany({
    where: {
      cidade_id: cidade,
      ...(busca && {
        OR: [
          { codigo: (Number.isNaN(parseInt(busca))) ? -1 : parseInt(busca) },
          { nome: { contains: busca, mode: "insensitive" } }
        ]
      }),
    },
    ...((pagina && quantidade) && {
      skip: (pagina - 1) * quantidade,
      take: quantidade
    })
  })

  return busLines;
}