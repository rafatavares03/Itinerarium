"use server"

import { success, z } from 'zod';
import { Ponto } from '@/types/ponto';
import { BusRoute } from '@/types/busRoute';
import { createRouteService, deleteRouteService, editRouteService, getBusRoutesService } from '@/lib/services/busRouteService';

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

const BusRouteSchema = z.object({
  id: z.number().int().positive(),
  ativo: z.boolean(),
  linha: z.number().int().positive(),
  ida: z.boolean(),
  vigencia: z.date().nullable(),
  updated_at: z.date(),
  pontos: z.array(
    z.object({
      id: z.number().int().positive().optional(),
      logradouro: z.string().optional(),
      numero: z.string().optional(),
      cidade_id: z.number().int().positive().optional(),
      coordenada: z.tuple([
        z.number(),
        z.number()
      ]),
      ordem: z.number().optional(),
      final: z.boolean().optional()
    })
  )
})

const createBusRouteSchema = z.object({
  active: z.boolean(),
  period: z.date().optional(),
  isOutbound: z.boolean(),
  line: z.number().int().positive(),
  busStops: z.array(PontoSchema)
});

export async function createRouteAction(data: {
  active: boolean,
  period?: Date,
  line: number,
  isOutbound: boolean
  busStops: Ponto[]
}) {
  const validation = createBusRouteSchema.safeParse(data);
  if(!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      data: undefined
    }
  }

  return await createRouteService(validation.data);
}

export async function editRouteAction(data: BusRoute) {
  const validation = BusRouteSchema.safeParse(data);
  if(!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      data: undefined
    }
  }

  return await editRouteService(validation.data);
}

export async function getBusRoutesAction(line: number) {
  const res = await getBusRoutesService(line);
  return res;
}

export async function deleteRouteAction(id: number) {
  const validation = z.number().int().positive().safeParse(id);
  if(!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors
    }
  }

  return await deleteRouteService(validation.data)
}