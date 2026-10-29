"use server";

import { z } from "zod";
import { auth } from "@/auth";
import {createCommentService, getCommentsByLineService} from "@/lib/services/commentService";

const createCommentSchema = z.object({
  text: z.string().trim().min(1, "O comentário não pode ser vazio.").max(1000),
  line: z.number().int().positive(),
});

const getCommentsActionSchema = z.object({
  line: z.coerce.number().int().positive(),
  page: z.coerce.number().int().positive().default(1),
  itemsAmount: z.coerce.number().int().positive().max(100).default(15),
  startDate: z.iso.date().optional(),
  endDate: z.iso.date().optional(),
});

type CommentState = {
  success: boolean;
  message?: string;
};

export async function createCommentAction(_prevState: CommentState,formData: FormData) {
  const validation = createCommentSchema.safeParse({
    text: formData.get("text"),
    line: Number(formData.get("line")),
  });

  if (!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0].message,
    };
  }

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      success: false,
      message: "Usuário não autenticado. Faça login para comentar.",
    };
  }

  return await createCommentService(validation.data.text, validation.data.line, userId);
}

export async function getCommentsByLineAction(
  line: number | string,
  page: number = 1,
  itemsAmount: number = 15,
  startDate?: string,
  endDate?: string
) {
  const validation = getCommentsActionSchema.safeParse({
    line,
    page,
    itemsAmount,
    startDate,
    endDate,
  });

  console.log(endDate);
  if(!validation.success) {
    return {
      success: false,
      message: validation.error.issues[0].message,
    };
  }

  const data = validation.data;

  return await getCommentsByLineService(
    data.line,
    data.page,
    data.itemsAmount,
    data.startDate ? new Date(data.startDate) : undefined,
    data.endDate ? new Date(data.endDate) : undefined
  );
}