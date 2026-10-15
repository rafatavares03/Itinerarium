'use client'

import { useActionState } from "react";
import Form from "next/form";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
  loginAction,
  undefined
);
  const inputStyle = "border-2 border-black";
  return (
    <Form action={formAction} className="flex flex-col gap-2 w-md mx-auto">
      <label htmlFor="email">Email:</label>
      <input type="email" name="email" id="email" className={inputStyle}/>
      <label htmlFor="password">Senha:</label>
      <input type="password" name="password" id="password" className={inputStyle}/>
      <button>Cadastrar</button>
      {state && !state.success && (
        <p>{state.message}</p>
      )}
    </Form>
  )
}