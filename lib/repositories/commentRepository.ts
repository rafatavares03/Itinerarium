import prisma from "@/lib/prisma";
import { Comment, CommentWithUser } from "@/types/comment";

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

export async function getCommentsByLine(
  line: number,
  page: number = 1,
  itemsAmount: number = 15,
  startDate?: Date,
  endDate?: Date
) {
  const where = {
    linnha_id: line,
    created_at: {
      ...(startDate && { gte: startDate }),
      ...(endDate && { lte: endDate }),
    },
  };

  const [comentarios, total] = await prisma.$transaction([
    prisma.comentario.findMany({
      where,
      include: {
        usuario: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
      skip: (page - 1) * itemsAmount,
      take: itemsAmount,
    }),
    prisma.comentario.count({ where }),
  ]);

  return {
    comentarios,
    pagination: {
      page,
      pageSize: itemsAmount,
      total,
      totalPages: Math.ceil(total / itemsAmount),
    },
  };
}