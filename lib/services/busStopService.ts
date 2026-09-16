'use server'

import { Ponto } from "@/types/ponto";
import { deletePoints, getBusStops, getPagesAmount,savePoints } from "../repositories/busStopRepository";

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

export async function getBusStopsService(
  params: {
    city: number,
    amount?: number,
    page?: number,
    address?: string,
    pagination?: boolean,
  }
) {
  try {
    if(!params.pagination) {
      let {busStops} = await getBusStops({city: params.city, address: params.address});
      return {
        success: true,
        data: {
          busStops
        }
      };
    }

    const {
      city,
      amount = 15,
      page = 1,
      address,
      pagination = true
    } = params;

    const [{ busStops }, { pagesAmount }] = await Promise.all([
      getBusStops(params),
      getPagesAmount(city, amount, address)
    ]);

    return {
      success: true,
      data: {
        busStops,
        pagesAmount
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