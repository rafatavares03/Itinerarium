"use server"

import { saveLinesService, getBusLines, getLineService } from "@/lib/services/busLineService";
import { z } from "zod";

const createBusLineSchema = z.object({
  id: z.coerce.number().optional(),
  city: z.coerce.number().int().positive(),
  origin: z.string().trim().min(1),
  destination: z.string().trim().min(1),
  code: z.string().trim().min(1),
  fare: z.string().trim().regex(/^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/, 
    "Informe uma tarifa válida, por exemplo: 5,50"
    ).transform((value) => value.replace(/\./g, "").replace(",", ".")),
});

export type CreateBusLineState = {
  success: boolean;
  errors?: {
    city?: string[];
    origin?: string[];
    destination?: string[];
    code?: string[];
    id?: string[];
    fare?: string[];
  };
  data?: {
    id: number;
    codigo: string;
    origem: string;
    destino: string;
    tarifa: string;
    cidade_id: number;
  };
  message?: string;
};

export async function createBusLineAction(prevState: CreateBusLineState, formData: FormData):Promise<CreateBusLineState> {
  const data = {
    id: formData.get("id") || undefined,
    city: formData.get("city"),
    origin: formData.get("origin"),
    destination: formData.get("destination"),
    code: formData.get("code"),
    fare: formData.get("fare"),
  }
  console.log(formData.get("fare"));
  const validation = createBusLineSchema.safeParse(data);
  if(!validation.success) {
    console.log(validation.error.flatten().fieldErrors)
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors
    };
  }
  const res = await saveLinesService(validation.data);
  if (!res.success || !res.data) {
    return {
      success: false,
      errors: {},
      message: res.message,
    };
  }

    return {
    success: true,
    data: {
      id: res.data.id,
      codigo: res.data.codigo,
      origem: res.data.origem,
      destino: res.data.destino,
      tarifa: res.data.tarifa.toString(),
      cidade_id: res.data.cidade_id,
    },
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

export async function getLineAction(id: number) {
  const validation = z.coerce.number().int().positive().safeParse(id);
  if(!validation.success) {
    return {
      success: false,
      data: undefined
    }
  }
  const res = await getLineService(validation.data);
  return res;
}