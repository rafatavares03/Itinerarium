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
  const inputStyle = "border-2 border-icy-aqua-400 outline-0 p-1 text-icy-aqua-100";
  const labelStyle = "text-icy-aqua-100 font-semibold";
  const buttonStyle = "bg-icy-aqua-700 text-icy-aqua-100 font-semibold my-2 mx-auto p-1 w-[200px] rounded-lg";
  const textStyle = "text-icy-aqua-100"
  return (
    <div className="flex flex-col justify-center items-center bg-space-indigo-800 p-5">
      <Form action={formAction} className="flex flex-col gap-2 w-md mx-auto">
        <label htmlFor="email" className={labelStyle}>Email:</label>
        <input type="email" name="email" id="email" className={inputStyle}/>
        <label htmlFor="password" className={labelStyle}>Senha:</label>
        <input type="password" name="password" id="password" className={inputStyle}/>
        <button className={buttonStyle}>Entrar</button>
        {state && !state.success && (
          <p>{state.message}</p>
        )}
      </Form>
      {onChangeMode &&
        <p className={textStyle}>Não tem conta? <button type="button" onClick={onChangeMode} className="font-bold text-icy-aqua-400">Cadastre-se</button></p>
      }
    </div>
  )
}