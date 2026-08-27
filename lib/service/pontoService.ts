'use server'

import { Ponto } from "@/types/ponto";
import { deletePoints, savePoints } from "../data/pontoDAO";

export async function salvarPontos(pontos: Ponto[]) {
  try {
    const dados = await savePoints(pontos);
    return {
      success: true,
      message: "Pontos salvos com sucesso."
    }
  } catch(e) {
    console.log(e);
    return {
      success: false,
      message: "Não foi possível salvar os pontos."
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