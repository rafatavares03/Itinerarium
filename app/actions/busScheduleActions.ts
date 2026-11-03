'use server'

import {
  getBusScheduleService,
  saveBusScheduleService,
} from "@/lib/services/busScheduleService";

import { z } from "zod";

const ScheduleSchema = z.object({
  funcionamento: z.number().int().positive().optional(),
  hora: z.coerce.date(),
  ida: z.boolean(),
});

const BusOperationAndScheduleSchema = z.object({
  id: z.number().int().positive().optional(),
  nome: z.string().trim().min(1),
  descricao: z.string().optional(),
  linha: z.number().int().positive(),
  horarios: z.array(ScheduleSchema),
});

export async function saveBusScheduleAction(
  data: unknown
) {
  const validation =
    BusOperationAndScheduleSchema.array().safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
    };
  }

  return await saveBusScheduleService(validation.data);
}

export async function getBusScheduleAction(line: number | string) {
  const validation = z.coerce.number().int().positive().safeParse(line);

  if (!validation.success) {
    return {
      success: false,
      data: [],
    };
  }

  return await getBusScheduleService(validation.data);
}