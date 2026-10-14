'use client'

import { useActionState } from "react";
import Form from "next/form";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
  loginAction,
  undefined
);
  return (
    <Form action={formAction}>
      <input type="email" name="email" id="email" />
      <input type="password" name="password" id="password" />
      <button>Entrar</button>
      {state && !state.success && (
        <p>{state.message}</p>
      )}
    </Form>
  )
}