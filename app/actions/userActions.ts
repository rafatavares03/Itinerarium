"use server";

import { z } from "zod";
import { getCityAdminsService, deleteUserService } from "@/lib/services/userService";
import { User } from "@/types/user";

const cityIdSchema = z.number().int().positive();

const userSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.email("E-mail inválido"),
  role: z.string().optional(),
  password: z.string().optional(),
  city: z.number().int().positive().optional(),
});


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

export async function deleteUserAction(user: User) {
  const validation = userSchema.safeParse(user);

  if (!validation.success) {
    return {
      success: false,
      message: "Dados do usuário inválidos",
    };
  }

  return await deleteUserService(validation.data);
}