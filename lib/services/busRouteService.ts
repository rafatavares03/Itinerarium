import { Ponto } from "@/types/ponto"
import { createRoute, deleteRoute, getBusRoutesByLine } from "../repositories/busRouteRepository"

export async function getBusRoutesService(line: number) {
  try{
    const res = await getBusRoutesByLine(line);
    return {
      success: true,
      data: res
    }
  } catch(e) {
    return {
      success: false,
      message: "Não foi possível buscar rotas dessa linha."
    }
  }
}

export async function createRouteService(data: {
  active: boolean,
  line: number,
  period?: Date,
  busStops: Ponto[]
}) {
  try {
    const res = createRoute(data);
    return {
      success: true,
      data: res
    }
  } catch(e) {
    console.log(e);
    return {
      success: false,
      message: "Não foi possível salvar rota"
    }
  }
}

export async function deleteRouteService(id: number) {
  try {
    const res = deleteRoute(id);
    return {
      success: true,
      data: res
    }
  } catch(e) {
    console.log(e);
    return {
      success: false,
      message: "Não foi possível apagar a rota"
    }
  }
}