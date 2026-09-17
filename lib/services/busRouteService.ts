import { Ponto } from "@/types/ponto"
import { createRoute } from "../repositories/busRouteRepository"

export async function createRouteService(data: {
  active: boolean,
  line: number,
  period?: Date,
  busStops: Ponto[]
}) {
  try {
    const res = createRoute(data);
    return {
      success: true
    }
  } catch(e) {
    console.log(e);
    return {
      success: false,
      message: "Não foi possível salvar rota"
    }
  }
}