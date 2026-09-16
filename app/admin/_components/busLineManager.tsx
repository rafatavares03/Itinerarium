"use client"

import { CidadeDetails } from "@/types/cidade"
import Form from "next/form"
import { createBusLineAction, CreateBusLineState } from "../actions/busLineActions";
import { useActionState } from "react";

const initialState: CreateBusLineState = {
  success: false,
};

export default function BusLineManager({
  city,
  onBackClick
}: {
  city: CidadeDetails | null,
  onBackClick: () => void
}) {
  const [state, createBusLine, isPending] = useActionState(createBusLineAction, initialState)
  const labelStyle = "font-semibold mr-3";
  const inputStyle = "bg-space-indigo-700 outline-0 text-white text-sm py-1 px-3 rounded-md";
  const buttonStyle = "px-5 py-1 bg-icy-aqua-400 rounded-md text-space-indigo-700 font-semibold cursor-pointer";

  if(!city) return <></>

  return (
    <div className="w-6xl">
      <button type="button" onClick={onBackClick}>Voltar</button>
      <Form action={createBusLine}>
        <div className="flex gap-3 w-full py-3">
          <input type="hidden" name="city" value={city.id}/>
          <div>
            <label htmlFor="code" className={labelStyle}>Código</label>
            <input type="text" name="code" id="code" className={inputStyle}/>
          </div>
          <div className="flex-1 flex">
            <label htmlFor="name" className={labelStyle}>Nome</label>
            <input type="text" name="name" id="name" className={inputStyle + " flex-1"}/>
          </div>
        </div>
        <button type="submit" className={buttonStyle}>Salvar</button>
      </Form>
    </div>
  )
}