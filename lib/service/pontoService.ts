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
  params: {
    quantidade?: number,
    pagina?: number,
    endereco?: string,
    paginado?: boolean,
  }
) {
  try {
    const {
      quantidade = 15,
      pagina = 1,
      endereco,
      paginado = true
    } = params;

    if (!paginado) {
      const { pontos } = await getPontos(cidadeId, {endereco: params.endereco})

      return {
        success: true,
        data: {
          pontos
        }
      };
    }

    const [{ pontos }, { quantidadePaginas }] = await Promise.all([
      getPontos(cidadeId, params),
      getPagesAmount(cidadeId, quantidade, endereco)
    ]);

    return {
      success: true,
      data: {
        pontos,
        quantidadePaginas
      }
    };

  } catch (e) {
    console.log(e);

    return {
      success: false,
      message: "Não foi possível carregar pontos"
    };
  }
}