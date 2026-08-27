'use client'

import { buscaCidadePorId } from "@/lib/service/cidadeService";
import { use, useEffect, useState } from "react";
import { CidadeDetails } from "@/types/cidade";
import dynamic from "next/dynamic";
import { CiCirclePlus } from "react-icons/ci";
import { Ponto } from "@/types/ponto";
import { salvarPontos, apagarPontos } from "@/lib/service/pontoService";
import { MdDelete } from "react-icons/md";

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
  const [pontosSelecionados, setPontosSelecionados] = useState<Ponto[]>([]);
  const [adicionar, setAdicionar] = useState(false)

  useEffect(() => {
    const carregarDados = async () => {
      const resposta = await buscaCidadePorId(parseInt(id));
      if(resposta.success) {
        console.log(resposta.dados?.pontos);
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

  function selecionaPonto(ponto: Ponto) {
    setPontosSelecionados((selecionados) => {
      if(selecionados.some(p => (p.coordenada[0] === ponto.coordenada[0]) && (p.coordenada[1] === ponto.coordenada[1]))) {
        return selecionados.filter((p) => (p.coordenada[0] != ponto.coordenada[0]) && (p.coordenada[1] != ponto.coordenada[1]));
      }

      return [...selecionados, ponto]
    })
  }

  function pontoSelecionado(ponto: Ponto) {
    return pontosSelecionados.some(p => p.coordenada[0] === ponto.coordenada[0] && p.coordenada[1] === ponto.coordenada[1])
  }

  async function SalvaPontos() {
    const resultado = await salvarPontos(pontos);
    console.log(resultado);
  }

  async function ApagarPontos() {
    const resultado = await apagarPontos(pontosSelecionados);
    console.log(resultado);
  }

  if(!cidade) {
    return (
      <p>Não foi possível exibir informações sobre a cidade no momento</p>
    )
  }

  const buttonStyle = "px-5 py-1 flex items-center gap-2 font-bold text-white rounded-sm"

  return (
    <>
      <h1 className="font-title mt-3 text-2xl text-center">{cidade.nome} - {cidade.uf}</h1>
      <div className="flex">
        <button type="button" 
          className={((adicionar) ? "bg-red-500 " : "bg-lime-500 ") + buttonStyle}
          onClick={() => setAdicionar(!adicionar)}
          >
          <CiCirclePlus className="size-[30px]"/>
          {(adicionar)? "Desabilitar" : "Adicionar"}
        </button>
        <button type="button" 
          className={"bg-red-500 " + buttonStyle}
          onClick={() => ApagarPontos()}
        >
          <MdDelete className="size-[30px]"/>
          Apagar
        </button>
      </div>
      <CidadeMap 
        center={[cidade.latitude, cidade.longitude]} 
        pontos={pontos} 
        onMapClick={MapClick}
        adicionarPontos={adicionar}
        onSelectPoint={selecionaPonto}
        isPointSelected={pontoSelecionado}
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