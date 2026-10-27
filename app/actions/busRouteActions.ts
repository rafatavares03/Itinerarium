'use server'

import { getBusRoutesService, getLineAndBusRoutesService } from '@/lib/services/busRouteService';
import { z } from 'zod';

export async function getBusRoutesAction(line: number) {
  const validation = z.number().int().positive().safeParse(line);
  if(!validation.success) {
    return {
      success: false,
      message: "Identificador da linha é inválido."
    }
  }

  const res = await getBusRoutesService(validation.data);
  return res;
}

export async function getLineAndRoutesAction(city: string, lineCode: string) {
  const validation = z.object({
    city: z.coerce.number().positive(),
    lineCode: z.string().trim().min(1)
  }).safeParse({city, lineCode});

  if(!validation.success) {
    return {
      success: false,
      message: "Cidade ou linha inválida."
    }
  }

  return await getLineAndBusRoutesService(validation.data.city, validation.data.lineCode);
}