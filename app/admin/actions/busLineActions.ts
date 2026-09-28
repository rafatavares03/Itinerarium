"use server"

import { saveLinesService, getBusLines } from "@/lib/services/busLineService";
import { z } from "zod";
import { BusLineBasic } from "@/types/busLine";

const createBusLineSchema = z.object({
  id: z.coerce.number().optional(),
  city: z.coerce.number().int().positive(),
  origin: z.string().trim().min(1),
  destination: z.string().trim().min(1),
  code: z.string().trim().min(1),
});

export type CreateBusLineState = {
  success: boolean;
  errors?: {
    city?: string[];
    origin?: string[];
    destination?: string[];
    code?: string[];
    id?: string[];
  };
  data?: {
    id: number;
    codigo: string;
    origem: string;
    destino: string;
    cidade_id: number;
  };
  message?: string;
};

export async function createBusLineAction(prevState: CreateBusLineState, formData: FormData) {
  const data = {
    id: formData.get("id"),
    city: formData.get("city"),
    origin: formData.get("origin"),
    destination: formData.get("destination"),
    code: formData.get("code"),
  }
  const validation = createBusLineSchema.safeParse(data);
  if(!validation.success) {
    console.log(validation.error.flatten().fieldErrors)
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors
    };
  }
  const res = await saveLinesService(validation.data);
  return {
    success: true,
    data: res.data,
    message: "Linha criada com sucesso!",
  };
}

export async function getBusLinesAction(city: number,  params: {
    amount?: number,
    page?: number,
    search?: string
  }) {
  const validation = z.coerce.number().int().positive().safeParse(city);
  if(!validation.success) {
    return {
      success: false,
      data: undefined
    }
  }
  const res = await getBusLines(validation.data, params);
  return res;
}