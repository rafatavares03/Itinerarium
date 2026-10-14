'use server'

import { createUserService } from "@/lib/services/userService";
import { saltAndHashPassword } from "@/utils/password";
import {z} from "zod";

type AccountState = {
  success: boolean;
  message?: {
    errors: string[];
    properties?: {
      name?: { errors: string[] };
      email?: { errors: string[] };
      password?: { errors: string[] };
      role?: { errors: string[] };
      city?: { errors: string[] };
    };
  };
};

const createUserSchema = z.object({
  name: z.string().trim().min(2),
  email: z.email({message: "Email inválido."}),
  role: z.string().trim().min(1).optional(),
  password: z.string().min(8)
                      .regex(/[0-9]/, "A senha deve conter pelo menos um número.")
                      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula.")
                      .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula."),
  city: z.coerce.number().positive().optional()
});

export async function createAccountAction(prevState: AccountState,formData: FormData) {
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role") || undefined,
    city: formData.get("city") || undefined
  }
  const validation = createUserSchema.safeParse(data);
  if(!validation.success) {
    console.log(z.treeifyError(validation.error))
    return {
      success: false,
      message: z.treeifyError(validation.error)
    }
  }
  validation.data.password = await saltAndHashPassword(validation.data.password);
  const result = await createUserService(validation.data);
  return result;
}