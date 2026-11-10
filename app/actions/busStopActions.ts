'use server'

import { z } from "zod";
import { getBusStopsService, savePointsService } from "@/lib/services/busStopService";
import { auth } from "@/auth";

const busStopSchema = z.object({
    id: z.number().int().positive().optional(),
    logradouro: z.string().min(1, "Logradouro é obrigatório."),
    numero: z.string(),
    cidade_id: z.number().int().positive(),
    time: z.coerce.date().optional(),
    coordenada: z.tuple([
        z.number().min(-180).max(180),
        z.number().min(-90).max(90)
    ])
});

const busStopsSchema = z.array(busStopSchema);

const getBusLinesSchema = z.object({
  city: z.coerce.number().int().positive(),
  amount: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().optional(),
  address: z.coerce.string().optional(),
  pagination: z.coerce.boolean().optional()
})

export async function savePointsAction(pontos: unknown) {
  const session = await auth();
  if(!session?.user) {
    return {
      success: false,
      message: "Usuário não autenticado.",
      data: []
    }
  }
  if(session.user.role !== "ADMIN" && session.user.role !== "ADMIN_MUN") {
    return {
      success: false,
      message: "Usuário sem permissão.",
      data: []
    }
  }
  const validation = busStopsSchema.safeParse(pontos);
  if(!validation.success) {
    return {
        success: false,
        message: "Dados dos pontos inválidos.",
        errors: validation.error.flatten(),
        data: []
    }
  }
  return await savePointsService(validation.data);
}

export async function getBusStopsAction(params: {
  city: number,
  amount?: number,
  page?: number,
  address?: string,
  pagination?: boolean
}) {
  const validation = getBusLinesSchema.safeParse(params);
  if(!validation.success) {
    return {
      success: false,
      data: undefined,
      errors: validation.error.flatten().fieldErrors
    };
  }

  return await getBusStopsService(validation.data);
}