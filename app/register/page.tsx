'use client'

import { useActionState } from "react";
import Form from "next/form";
import { createAccountAction } from "./actions";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(
  createAccountAction,
  { success: false }
);
  return (
    <Form action={formAction}>
      <input type="text" name="name" id="name" />
      <input type="email" name="email" id="email" />
      <input type="password" name="password" id="password" />
      <button>Cadastrar</button>
    </Form>
  )
}