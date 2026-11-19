import prisma from "@/lib/prisma";

export async function createComment(
  text: string,
  email: string,
  line: number
) {
  return await prisma.comentario.create({
    data: {
      texto: text,
      email: email,
      created_at: new Date(),
      linha: {
        connect: { id: line },
      }
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