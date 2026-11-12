'use client'

import { useActionState } from "react";
import Form from "next/form";
import { createAccountAction } from "../../actions/registerActions";

export default function RegisterForm({
  onChangeMode,
  cityId
}: {
  onChangeMode?: () => void,
  cityId?: string
}) {
  const [state, formAction, pending] = useActionState(
  createAccountAction,
  { success: false }
);
  const inputStyle = "border-2 border-icy-aqua-400 outline-0 p-1 text-icy-aqua-100";
  const labelStyle = "text-icy-aqua-100 font-semibold";
  const buttonStyle = "bg-icy-aqua-700 text-icy-aqua-100 font-semibold my-2 mx-auto p-1 w-[200px] rounded-lg";
  const textStyle = "text-icy-aqua-100"
  return (
    <div className="flex flex-col justify-center items-center bg-space-indigo-800 p-5">
      <Form action={formAction} className="flex flex-col gap-2 w-md mx-auto">
        {cityId &&
          <>
            <input type="hidden" name="city" id="city" value={cityId} />
            <input type="hidden" name="role" id="role" value="ADMIN_MUN"/>
          </>
        }
        <label htmlFor="name" className={labelStyle}>Nome:</label>
        <input type="text" name="name" id="name" className={inputStyle}/>
        <label htmlFor="email" className={labelStyle}>Email:</label>
        <input type="email" name="email" id="email" className={inputStyle}/>
        <label htmlFor="password" className={labelStyle}>Senha:</label>
        <input type="password" name="password" id="password" className={inputStyle}/>
        <button className={buttonStyle}>Cadastrar</button>
      </Form>
      {onChangeMode &&
        <p className={textStyle}>Já tem conta? <button type="button" onClick={onChangeMode} className="font-bold text-icy-aqua-400">Entrar</button></p>
      }
    </div>
  )
}