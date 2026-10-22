'use client'

import { useActionState } from "react";
import Form from "next/form";
import { loginAction } from "../../actions/loginActions";

export default function LoginForm({
  onChangeMode
}: {
  onChangeMode?: () => void
}) {
  const [state, formAction, pending] = useActionState(
  loginAction,
  undefined
);
  const inputStyle = "border-2 border-black";
  return (
    <div className="flex flex-col justify-center items-center bg-white p-5">
      <Form action={formAction} className="flex flex-col gap-2 w-md mx-auto">
        <label htmlFor="email">Email:</label>
        <input type="email" name="email" id="email" className={inputStyle}/>
        <label htmlFor="password">Senha:</label>
        <input type="password" name="password" id="password" className={inputStyle}/>
        <button>Entrar</button>
        {state && !state.success && (
          <p>{state.message}</p>
        )}
      </Form>
      {onChangeMode &&
        <p>Não tem conta? <button type="button" onClick={onChangeMode}>Cadastre-se</button></p>
      }
    </div>
  )
}