"use server";

import { z } from "zod";
import { getCityAdminsService } from "@/lib/services/userService";

const cityIdSchema = z.number().int().positive();

export async function getCityAdminsAction(cityId: number) {
  const validation = cityIdSchema.safeParse(cityId);

  if (!validation.success) {
    return {
      success: false,
      message: "ID da cidade inválido",
    };
  }
  
  return await getCityAdminsService(validation.data);
}