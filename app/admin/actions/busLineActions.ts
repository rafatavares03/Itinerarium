"use server"

import { createBusLine, getBusLines } from "@/lib/services/busLineService";
import { z } from "zod";
import { LinhaBasic } from "@/types/linha";

const createBusLineSchema = z.object({
  city: z.coerce.number().int().positive(),
  name: z.string().trim().min(1),
  code: z.coerce.number().int().positive(),
});

export type CreateBusLineState = {
  success: boolean;
  data?: LinhaBasic;
  message?: string;
  errors?: {
    city?: string[];
    name?: string[];
    code?: string[];
  };
};

export async function createBusLineAction(prevState: CreateBusLineState, formData: FormData) {
  const data = {
    city: formData.get("city"),
    name: formData.get("name"),
    code: formData.get("code"),
  }
  const validation = createBusLineSchema.safeParse(data);
  if(!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors
    };
  }
  const res = await createBusLine(validation.data);
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
  const res = await getBusLines(city, {});
  return res;
}