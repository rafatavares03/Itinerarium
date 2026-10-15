'use server'

import { getBusScheduleService, saveBusScheduleService } from "@/lib/services/busScheduleService";
import { BusSchedule } from "@/types/busSchedule";
import { z } from "zod";

const BusScheduleSchema = z.object({
  hora: z.date(),
  ida: z.boolean(),
  linha: z.number().positive()
});

export async function saveBusScheduleAction(data: BusSchedule[]) {
  const validation = BusScheduleSchema.array().safeParse(data);
  
  if(!validation.success) {
    return {
      success: false
    }
  }

  return await saveBusScheduleService(validation.data)
}

export async function getBusScheduleAction(line: number) {
  const validation = z.number().positive().safeParse(line);

  if(!validation.success) {
    return {
      success: false,
      data: []
    }
  }

  return await getBusScheduleService(validation.data);
}