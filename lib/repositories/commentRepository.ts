import prisma from "@/lib/prisma";

export async function createComment(
  text: string,
  line: number,
  userId: string
) {
  return await prisma.comentario.create({
    data: {
      texto: text,
      created_at: new Date(),
      linha: {
        connect: { id: line },
      },
      usuario: {
        connect: { id: userId },
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
    linha_id: line,
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