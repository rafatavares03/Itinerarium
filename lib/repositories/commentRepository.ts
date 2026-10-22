import prisma from "@/lib/prisma";
import type { Comentario } from "@/app/generated/prisma/client";

export async function createComment(
  texto: string,
  linhaId: number,
  usuarioId: string
) {
  return await prisma.comentario.create({
    data: {
      texto,
      created_at: new Date(),
      linha: {
        connect: { id: linhaId },
      },
      usuario: {
        connect: { id: usuarioId },
      },
    },
  });
}

export async function getCommentsByCity(
  cityId: number,
  page: number = 1,
  pageSize: number = 10
) {
  return await prisma.comentario.findMany({
    where: {
      linha: {
        cidade_id: cityId,
      },
    },
    orderBy: {
      created_at: "desc",
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      usuario: {
        select: {
          id: true,
          name: true,
        },
      },
      linha: {
        select: {
          id: true,
          codigo: true,
        },
      },
    },
  });
}