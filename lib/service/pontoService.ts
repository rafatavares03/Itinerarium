'use server'

import { Ponto } from "@/types/ponto";
import { deletePoints, getPontos, getPagesAmount,savePoints } from "../data/pontoDAO";

export async function salvarPontos(pontos: Ponto[]) {
  try {
    const dados = await savePoints(pontos);
    return {
      success: true,
      message: "Pontos salvos com sucesso.",
      data: dados ?? []
    }
  } catch(e) {
    console.log(e);
    return {
      success: false,
      message: "Não foi possível salvar os pontos.",
      data: []
    }
  }
}

export async function apagarPontos(pontos: Ponto[]) {
  try {
    const dados = await deletePoints(pontos);
    return {
      success: true,
      message: "Pontos apagados com sucesso."
    }
  } catch(e) {
    console.log(e)
    return {
      success: false,
      message: "Não foi possível apagar os pontos."
    }
  }
}

export async function buscarPontos(
  cidadeId: number,
  quantidade: number,
  pagina: number
) {
  try {
    const [{ pontosFormatados }, { quantidadePaginas }] = await Promise.all([
      getPontos(cidadeId, quantidade, pagina),
      getPagesAmount(cidadeId, quantidade)
    ]);

    return {
      success: true,
      data: {
        pontos: pontosFormatados,
        quantidadePaginas
      }
    }
  } catch(e) {
    console.log(e);
    return {
      success: false,
      message: "Não foi possível carregar pontos"
    }
  }
}