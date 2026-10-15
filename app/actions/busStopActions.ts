import { z } from "zod";
import { getBusStopsService } from "@/lib/services/busStopService";

const getBusLinesSchema = z.object({
  city: z.coerce.number().int().positive(),
  amount: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().optional(),
  address: z.coerce.string().optional(),
  pagination: z.coerce.boolean().optional()
})

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