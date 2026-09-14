'use client'

import { buscaCidadePorId } from "@/lib/service/cidadeService";
import { use, useEffect, useState } from "react";
import { CidadeDetails } from "@/types/cidade";
import { BusStopManager } from "@/app/components/pontosOnibusManager";
import { JSX } from "react";

enum Abas {
  pontos = "Pontos",
  linhas = "Linhas",
}

export default function City({
  params,
}: {
  params: Promise<{id: string}>
}) {
  const {id} = use(params);
  const [cidade, setCidade] = useState<CidadeDetails | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<Abas>(Abas.pontos);
  const componentMap: Record<Abas, () => JSX.Element> = {
    [Abas.pontos]: () => <BusStopManager cidade={cidade}/>,
    [Abas.linhas]: () => <p>Nenhuma informação no momento</p>
  }
  const ComponenteSelecionado = componentMap[abaAtiva];

  useEffect(() => {
    const carregarDados = async () => {
      const resposta = await buscaCidadePorId(parseInt(id));
      if(resposta.success) {
        setCidade(resposta.dados?.cidade ?? null);
      }
    }
    carregarDados();
  }, []);

  if(!cidade) {
    return (
      <p>Não foi possível exibir informações sobre a cidade no momento</p>
    )
  }

  
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="font-title mt-3 text-2xl text-center">{cidade.nome} - {cidade.uf}</h1>
      <div>
        <button type="button" onClick={() => setAbaAtiva(Abas.pontos)}>Pontos</button>
        <button type="button" onClick={() => setAbaAtiva(Abas.linhas)}>Linhas</button>
      </div>
      <ComponenteSelecionado />
    </div>
  )
}