'use server'

import { getCidades, getById } from "../data/cityRepository";

export async function buscaCidades(dados: {
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

export async function buscaCidadePorId(id: number) {
  try {
    const dados = await getById(id);

    if(!dados) {
      return {
        sucess: false,
        message: "Cidade não encontrada."
      }
    }

    return {
      success: true,
      dados
    }
  } catch(e) {
    console.log(e);
    return {
      success: false,
      message: "Não foi possível carregar dados da cidade"
    }
  }
}