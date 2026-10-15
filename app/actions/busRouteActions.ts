'use server'

import { getBusRoutesService } from '@/lib/services/busRouteService';
import { z } from 'zod';

export async function getBusRoutesAction(line: number) {
  const validation = z.number().int().positive().safeParse(line);
  if(!validation.success) {
    return {
      success: false,
      message: "Identiifcador da linha é inválido."
    }
  }

  const res = await getBusRoutesService(validation.data);
  console.log(res);
  return res;
}