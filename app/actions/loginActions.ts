"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe sua senha."),
});

type LoginState = {
  success: boolean;
  message: string;
  errors?: {
    email?: string[];
    password?: string[];
  };
};

export async function loginAction(
  prevState: LoginState | undefined,
  formData: FormData
): Promise<LoginState | undefined> {
  const validation = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validation.success) {
    return {
      success: false,
      message: "Verifique os campos informados.",
      errors: z.flattenError(validation.error).fieldErrors,
    };
  }

  const { email, password } = validation.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });

    return { success: true, message: "" };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: "E-mail ou senha inválidos.",
      };
    }

    throw error;
  }
}