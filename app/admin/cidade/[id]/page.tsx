'use client'

import { buscaCidadePorId } from "@/lib/service/cidadeService";
import { use, useEffect, useState } from "react";
import { CidadeDetails } from "@/types/cidade";
import dynamic from "next/dynamic";
import { CiCirclePlus } from "react-icons/ci";
import { Ponto } from "@/types/ponto";
import { salvarPontos } from "@/lib/service/pontoService";

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
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [adicionar, setAdicionar] = useState(false)

  useEffect(() => {
    const carregarDados = async () => {
      const resposta = await buscaCidadePorId(parseInt(id));
      if(resposta.success) {
        setCidade(resposta.dados?.cidade ?? null);
        setPontos(resposta.dados?.pontos ?? [])
      }
    }
    carregarDados();
  }, []);

  function MapClick(latitude: number, longitude: number) {
    if(!cidade) return;
    setPontos((pontos) => [
      ...pontos,
      {
        cidade_id: cidade?.id,
        coordenada: [latitude, longitude],
      }
    ]);
  }

  async function SalvaPontos() {
    const resultado = await salvarPontos(pontos);
    console.log(resultado);
  }

  if(!cidade) {
    return (
      <p>Não foi possível exibir informações sobre a cidade no momento</p>
    )
  }

  return (
    <>
      <h1 className="font-title mt-3 text-2xl text-center">{cidade.nome} - {cidade.uf}</h1>
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
      <button type="button" 
        className="bg-space-indigo-800 text-white"
        onClick={() => SalvaPontos()}
      >
        Salvar
      </button>
    </>
  )
}