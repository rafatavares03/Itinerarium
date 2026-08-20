'use server'

import { getCidades } from "../data/cidadeDAO";

export async function buscarCidades(dados: {
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