'use client'

import { buscaCidadePorId } from "@/lib/service/cidadeService";
import { use, useEffect, useState } from "react";
import { CidadeDetails } from "@/types/cidade";
import dynamic from "next/dynamic";
import { CiCirclePlus } from "react-icons/ci";

const CidadeMap = dynamic(
  () => import("@/app/components/cidadeMap"),
  {
    ssr: false,
  }
);

export default function City({
  params,
}: {
  params: Promise<{id: string}>
}) {
  const {id} = use(params);
  const [cidade, setCidade] = useState<CidadeDetails | null>(null);
  const [pontos, setPontos] = useState<[number, number][]>([]);
  const [adicionar, setAdicionar] = useState(false)

  useEffect(() => {
    const carregarDados = async () => {
      const resposta = await buscaCidadePorId(parseInt(id));
      if(resposta.success) {
        setCidade(resposta.dados ?? null);
      }
    }
    carregarDados();
  }, []);

  function MapClick(latitude: number, longitude: number) {
    setPontos((pontos) => [
      ...pontos,
      [latitude, longitude],
    ]);
  }

  if(!cidade) {
    return (
      <p>Não foi possível exibir informações sobre a cidade no momento</p>
    )
  }

  return (
    <>
      <h1>{cidade.nome}</h1>
      <button type="button" 
        className={((adicionar) ? "bg-red-500" : "bg-lime-500") + " px-5 py-1 flex items-center gap-2 font-bold text-white rounded-sm"}
        onClick={() => setAdicionar(!adicionar)}
      >
        <CiCirclePlus className="size-[30px]"/>
        {(adicionar)? "Desabilitar" : "Adicionar"}
      </button>
      <CidadeMap 
        center={[cidade.latitude, cidade.longitude]} 
        pontos={pontos} 
        onMapClick={MapClick}
        adicionarPontos={adicionar}
      />
    </>
  )
}