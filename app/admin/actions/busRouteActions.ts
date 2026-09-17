"use server"

import { z } from 'zod';
import { Ponto } from '@/types/ponto';
import { createRouteService } from '@/lib/services/busRouteService';

const PontoSchema = z.object({
  id: z.number().int().positive().optional(),
  logradouro: z.string(),
  numero: z.string(),
  cidade_id: z.number().int().positive(),
  coordenada: z.tuple([
    z.number(),
    z.number()
  ])
});

const createBusRouteSchema = z.object({
  active: z.boolean(),
  period: z.date().optional(),
  line: z.number().int().positive(),
  busStops: z.array(PontoSchema)
});

export async function createRouteAction(data: {
  active: boolean,
  period?: Date,
  line: number,
  busStops: Ponto[]
}) {
  const validation = createBusRouteSchema.safeParse(data);
  if(!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors
    }
  }

  return await createRouteService(validation.data);
}