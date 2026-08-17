'use client'

import { criaCidade } from "./actions";
import Modal from "@/app/components/modal";
import { useState } from "react";
import Form from 'next/form';
import { IoIosCloseCircle } from "react-icons/io";

export default function City() {
  const [cadastrarModal, setCadastrarModal] = useState(false);

  function exibirModalCadastro(){
    setCadastrarModal(true);
  }

  function fecharModalCadastro() {
    setCadastrarModal(false);
  }

  const inputStyle = "bg-space-indigo-800 mt-4 outline-0 py-2 px-5 rounded-md";
  const buttonStyle = "bg-icy-aqua-400 cursor-pointer font-display font-semibold py-1 mx-auto rounded-sm text-space-indigo-900 w-[220px]";

  return (
    <div className="m-auto py-5 w-7xl">
      <Modal open={cadastrarModal}>
        <div className="bg-space-indigo-900 h-[340px] m-auto text-white rounded-[20px] py-5 px-10 w-2xl">
          <Form action={criaCidade} className="flex flex-col h-full justify-between relative text-icy-aqua-50">
            <IoIosCloseCircle className="absolute cursor-pointer size-[30px] -top-px right-[-15px]" onClick={fecharModalCadastro}/>
            <h2 className="font-semibold font-display text-2xl text-center">Registrar nova cidade</h2>
            <div className="flex gap-3">
              <div className="flex-1 flex flex-col">
                <label htmlFor="cidadeNome">Nome:</label>
                <input type="text" name="cidadeNome" id="cidadeNome" className={inputStyle} />
              </div>

              <div className="flex flex-col w-[100px]">
                <label htmlFor="cidadeUF">UF:</label>
                <input type="text" name="cidadeUF" id="cidadeUF" className={inputStyle} />
              </div>
            </div>

            <button type="submit" className={buttonStyle}>Confirmar</button>
          </Form>
        </div>
      </Modal>

      <div>
        <div onClick={exibirModalCadastro}>Cadastrar</div>
      </div>
    </div>
  );
}