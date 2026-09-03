'use server'

import { Ponto } from "@/types/ponto";
import { deletePoints, savePoints } from "../data/pontoDAO";

export async function reverseGeocode(
  latitude: number,
  longitude: number
) {
  const response = await fetch(
    `https://photon.komoot.io/reverse?lat=${latitude}&lon=${longitude}`
  );

  if (!response.ok) {
    console.log(response);
    return null;
    throw new Error("Erro ao consultar o Photon");
  }

  const data = await response.json();

  const result = data.features?.[0]?.properties;

  if (!result) {
    return null;
  }

  return {
    endereco: [
      result.street,
      result.housenumber,
      result.city,
      result.state
    ]
      .filter(Boolean)
      .join(", ")
  };
}

export async function salvarPontos(pontos: Ponto[]) {
  try {
    for(let i = 0; i < pontos.length; i++) {
      if(!pontos[i].endereco || pontos[i].endereco?.trim().length === 0) {
        const resultado = await reverseGeocode(pontos[i].coordenada[0], pontos[i].coordenada[1]);
        console.log(resultado);
        if(resultado) {
          pontos[i].endereco = resultado.endereco;
        }
      }
    }
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