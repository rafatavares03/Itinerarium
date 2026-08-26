'use client'

import { buscaCidadePorId } from "@/lib/service/cidadeService";
import { use, useEffect, useState } from "react";
import { CidadeDetails } from "@/types/cidade";
import dynamic from "next/dynamic";

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
  const [cidade, setCidade] = useState<CidadeDetails | null>(null)

  useEffect(() => {
    const carregarDados = async () => {
      const resposta = await buscaCidadePorId(parseInt(id));
      if(resposta.success) {
        setCidade(resposta.dados ?? null);
      }
    }
    carregarDados();
  }, [])

  if(!cidade) {
    return (
      <p>Não foi possível exibir informações sobre a cidade no momento</p>
    )
  }

  return (
    <>
      <h1>{cidade.nome}</h1>
      
      <CidadeMap center={[cidade.latitude, cidade.longitude]}/>
    </>
  )
}