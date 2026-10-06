"use server"

import { z } from 'zod';
import { Ponto } from '@/types/ponto';
import { BusRoute } from '@/types/busRoute';
import { 
  activateRouteService, 
  createRouteService, 
  deleteRouteService, 
  editRouteService, 
  getBusRoutesService, 
  temporarilyActivateRouteService
} from '@/lib/services/busRouteService';

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

export async function activateRouteAction(prevState: {success: boolean} , data: FormData) {
  const routeValue = data.get("route");
  const validityValue = data.get("validity");

  if (typeof routeValue !== "string") {
    return { success: false };
  }

  let route;

  try {
    route = JSON.parse(routeValue);
  } catch {
    return { success: false };
  }

  const validity =
    typeof validityValue === "string" && validityValue !== ""
      ? new Date(validityValue)
      : null;

  const validation = BusRouteSchema.safeParse({
    ...route,
    vigencia: validity,
  });

  if (!validation.success) {
    return { success: false };
  }

  if (validity) {
    return await temporarilyActivateRouteService(
      validation.data,
      validity
    );
  }

  return await activateRouteService(validation.data);
}