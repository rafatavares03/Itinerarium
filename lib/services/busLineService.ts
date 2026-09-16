import { LinhaBasic } from "@/types/linha";
import { createLine, getLine } from "../repositories/busLineRepository"

export async function getBusLines(
  city: number, 
  params: {
    amount?: number,
    page?: number,
    search?: string
  }) {
    try {
      const data = await getLine(city, params);
      return {
        success: true,
        data
      }
    } catch(e) {
      console.log(e);
      return {
        success: false,
        message: "Não foi possível buscar dados",
      }
    }
}

export async function createBusLine(params: {name: string, code: number, city: number}) {
  try {
    const data = await createLine(params);
    return {
      success: true,
      data
    }
  } catch(e) {
    console.log(e);
    return {
      success: false,
      message: "Não foi possível buscar dados"
    }
  }
}