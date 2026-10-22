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
  const inputStyle = "border-2 border-black";
  return (
    <div className="flex flex-col justify-center items-center bg-white p-5">
      <Form action={formAction} className="flex flex-col gap-2 w-md mx-auto">
        {cityId &&
          <>
            <input type="hidden" name="city" id="city" value={cityId} />
            <input type="hidden" name="role" id="role" value="ADMIN_MUN"/>
          </>
        }
        <label htmlFor="name">Nome:</label>
        <input type="text" name="name" id="name" className={inputStyle}/>
        <label htmlFor="email">Email:</label>
        <input type="email" name="email" id="email" className={inputStyle}/>
        <label htmlFor="password">Senha:</label>
        <input type="password" name="password" id="password" className={inputStyle}/>
        <button>Cadastrar</button>
      </Form>
      {onChangeMode &&
        <p>Já tem conta? <button type="button" onClick={onChangeMode}>Entrar</button></p>
      }
    </div>
  )
}