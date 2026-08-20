'use client'

import { criaCidade } from "./actions";
import Modal from "@/app/components/modal";
import { useEffect, useState } from "react";
import Form from 'next/form';
import Link from "next/link";
import { IoIosCloseCircle, IoMdAdd } from "react-icons/io";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { buscarCidades } from "@/lib/service/cidadeService";

type CidadeDados = {
  nome: string,
  uf: string,
  id: number
}

export default function Cities() {
  const [cadastrarModal, setCadastrarModal] = useState(false);
  const [cidades, setCidades] = useState<CidadeDados[]>([]);
  const [form, setForm] = useState({
    nome: '',
    quantidade: 10,
    pagina: 1
  });

  function exibirModalCadastro(){
    setCadastrarModal(true);
  }

  function fecharModalCadastro() {
    setCadastrarModal(false);
  }

  useEffect(() => {
    const carregarCidades = async () => {
      const dados = await buscarCidades(form);
      if(dados.success) {
        if(dados.cidades) {
          setCidades(dados.cidades);
        }
      }
    }

    carregarCidades();
  }, [])

  useEffect(() => {
    const timeout = setTimeout(async () => {
     const dados = await buscarCidades(form);

      if (dados.success) {
        if(dados.cidades) {
          setCidades(dados.cidades);
        }
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [form.nome, form.pagina])

  const inputStyle = "bg-space-indigo-800 mt-4 outline-0 py-2 px-5 rounded-md";
  const buttonStyle = "bg-icy-aqua-400 cursor-pointer font-display font-semibold py-1 mx-auto rounded-sm text-space-indigo-900 w-[220px]";

  return (
    <div className="m-auto py-5 w-6xl">
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

      <div className="flex flex-row items-center justify-around gap-10">
        <div className="bg-icy-aqua-400 border-3 border-icy-aqua-400 flex-1 flex items-center justify-center gap-1 rounded-3xl pl-3">
            <label htmlFor="buscaCidade" className="font-semibold">Pesquisar</label>
            <input 
              type="text" 
              name="buscaCidade" 
              id="buscaCidade" 
              className="bg-space-indigo-800 outline-0 rounded-3xl px-5 py-1 text-icy-aqua-100 w-full"
              placeholder="Pesquise uma cidade..."
              onChange={(e) => {
                  setForm((form) => ({
                    ...form,
                    nome: e.target.value,
                    pagina: 1
                  }))
                }
              }
              />
        </div>
        <div 
          className="bg-space-indigo-800 cursor-pointer flex items-center gap-2 justify-center font-semibold py-1 rounded-3xl text-center text-display text-icy-aqua-100 w-[175px]" 
          onClick={exibirModalCadastro}
        >
          <IoMdAdd className="inline size-[30px]"/>
          <span className="text-md">Cadastrar</span>
        </div>
      </div>

      {(cidades.length === 0) ? <p>Não há cidades disponíveis.</p> : 
        <div className="flex flex-col gap-5 py-10">
          {cidades.map((cidade:any) => {
            return (
              <div key={cidade.id} 
                className="bg-white border border-white flex items-center justify-between h-[60px] hover:border-icy-aqua-400 px-5 rounded-sm"
              >
                <p className="font-semibold">{cidade.nome} - {cidade.uf}</p>
                <div>
                  <Link href={`/admin/cidade/${cidade.id}`}><FaArrowAltCircleRight className="text-icy-aqua-400 size-[30px]"/></Link>
                </div>
              </div>
            )
          })}
        </div>
      
      }

    </div>
  );
}