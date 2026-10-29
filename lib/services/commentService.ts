import { createComment, getCommentsByLine } from "@/lib/repositories/commentRepository";

export async function createCommentService(text:string, line: number, userId: string) {
  try {
    await createComment(text, line, userId);
    return {
      success: true,
      message: "Comentário salvo com sucesso."
    }
  } catch(e) {
    console.log(e);
    return {
      success: false,
      message: "Ocorreu um erro ao salvar o comentário. Tente novamente mais tarde."
    }
  }
}


export async function getCommentsByLineService(
  line: number,
  page: number = 1,
  itemsAmount: number = 15,
  startDate?: Date,
  endDate?: Date
) {
  if(startDate && endDate && startDate > endDate) {
    return {
      success: false,
      message: "A data inicial não pode ser posterior à data final.",
    };
  }

  try {
    const result = await getCommentsByLine(line, page, itemsAmount, startDate, endDate);

    return {
      success: true,
      data: result,
    };
  } catch(e) {
    console.log(e);
    return {
      success: false,
      message: "Não foi possível buscar os comentários.",
    };
  }
}