'use server'

import { getCidades, getById, getCityBounds, getCityBasicInfo } from "../repositories/cityRepository";

export async function getCitiesAction(dados: {
  nome?: string,
  quantidade: number,
  pagina?: number
}) {
  try {
    const cidades = await getCidades(dados);
    return {
      success: true,
      cidades
    };
  } catch(e) {
    console.error("Erro ao buscar cidades:", e);
    return {
      success: false,
      message: "Não foi possível realizar a busca"
    }
  }
}

export async function getCity(id: number) {
  try {
    const dados = await getById(id);

    if(!dados) {
      return {
        success: false,
        message: "Cidade não encontrada."
      }
    }

    return {
      success: true,
      data: dados
    }
  } catch(e) {
    console.log(e);
    return {
      success: false,
      message: "Não foi possível carregar dados da cidade"
    }
  }
}

export async function getCityBasicInfoService(id: number) {
  try {
    const data = await getCityBasicInfo(id);
    return {
      success: true,
      data
    }
  } catch(e) {
    console.log(e);
    return {
      success: false,
      message: "Não foi possível recuperar o enquadramento da cidade"
    }
  }
}

export async function getCityBoundsService(id: number) {
  try {
    const data = await getCityBounds(id);
    return {
      success: true,
      data
    }
  } catch(e) {
    console.log(e);
    return {
      success: false,
      message: "Não foi possível recuperar o enquadramento da cidade"
    }
  }
}