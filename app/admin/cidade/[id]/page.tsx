'use client'

import { buscaCidadePorId } from "@/lib/service/cidadeService";
import { use, useEffect, useState } from "react";
import { CidadeDetails } from "@/types/cidade";
import { BusStopManager } from "@/app/components/pontosOnibusManager";
import dynamic from "next/dynamic";
import { CiCirclePlus } from "react-icons/ci";
import { Ponto } from "@/types/ponto";
import { salvarPontos, apagarPontos, buscarPontos } from "@/lib/service/pontoService";
import PontosMenu from "../../_components/PontosMenu";

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
  
  
  const [registrados, setRegistrados] = useState<Ponto[]>([]);
  const [selecionados, setSelecionados] = useState<Ponto[]>([]);
  const [novos, setNovos] = useState<Ponto[]>([]);
  const [pontosMapa, setPontosMapa] = useState<Ponto[]>([]);
  const [edicao, setEdicao] = useState(false);
  const [paginas, setPaginas] = useState({
    atual: 1,
    total: 1
  });
  

  useEffect(() => {
    const carregarDados = async () => {
      const resposta = await buscaCidadePorId(parseInt(id));
      if(resposta.success) {
        setCidade(resposta.dados?.cidade ?? null);
      }
    }
    carregarDados();
  }, []);

  useEffect(() => { 
    const carregarPontos = async () => { 
      const resposta = await buscarPontos(parseInt(id), 15, paginas.atual); 
      if(resposta.success) { 
        setRegistrados(resposta.data?.pontos ?? []); 
        setPaginas({
          atual: paginas.atual,
          total: resposta.data?.quantidadePaginas ?? 1
        })
      }} 
      
    carregarPontos(); 
  }, [id, paginas.atual, pontosMapa.length]);

  

  // function comparaPontoPorCoordenada(p1: Ponto, p2: Ponto) {
  //   return (p1.coordenada[0] === p2.coordenada[0]) && (p1.coordenada[1] === p2.coordenada[1]);
  // }

  // function adicionaPontoEmDestaque(p: Ponto) {
  //   setPontoEmFoco((atual) => {
  //     if(!atual) {
  //       return p;
  //     }

  //     return comparaPontoPorCoordenada(atual, p) ? null : p;
  //   });
  // }

  // function selecionaPonto(ponto: Ponto) {
  //   if(!ponto.id) {
  //     adicionaPontoEmDestaque(ponto);
  //     return;
  //   }

  //   setSelecionados((selecionados) => {
  //     if(selecionados.some(p => comparaPontoPorCoordenada(p, ponto))) {
  //       return selecionados.filter((p) => !comparaPontoPorCoordenada(p, ponto));
  //     }

  //     return [...selecionados, ponto];
  //   })

  //   if(!ponto.id) {
  //     adicionaPontoEmDestaque(ponto);
  //   } else {
  //     setEdicao(false);
  //   }
  // }

  // function apagaNovo(ponto: Ponto){
  //   setNovos((atuais) => {
  //     return atuais.filter((p) => !comparaPontoPorCoordenada(p, ponto));
  //   });
  //   if(pontoEmFoco && comparaPontoPorCoordenada(ponto, pontoEmFoco)) {
  //     setPontoEmFoco(null);
  //     setEdicao(false);
  //   }
  // }

  // function pontoSelecionado(ponto: Ponto) {
  //   return selecionados.some(p => p.coordenada[0] === ponto.coordenada[0] && p.coordenada[1] === ponto.coordenada[1])
  // }

  // function pontoDestacado(ponto: Ponto) {
  //   if(!pontoEmFoco) return false;
  //   return comparaPontoPorCoordenada(ponto, pontoEmFoco);
  // }

  // async function editarPonto(antigo: Ponto, novo: Ponto) {
  //   if(!antigo.id) {
  //     setNovos((novos) => 
  //       novos.map(ponto => 
  //         (ponto.coordenada[0] === antigo.coordenada[0] && ponto.coordenada[1] === antigo.coordenada[1]) ? novo : ponto
  //       )
  //     );
  //   } else {
  //     const resultado = await salvarPontos(new Array(novo));
  //     if(resultado.success) {
  //       setPontosMapa((registrados) => 
  //         registrados.map(ponto => ponto.id === novo.id ? novo : ponto)
  //       );
  //     }
  //   }
  // }

  // async function adicionarPontos() {
  //   const resultado = await salvarPontos(novos);
  //   if(resultado.success) {
  //     setPontosMapa((pontos) => [
  //       ...pontos,
  //       ...resultado.data
  //     ])
  //     setNovos([]);
  //     setPontoEmFoco(null);
  //     setEdicao(false);
  //   }
  // }

  // async function excluirPontos() {
  //   const resultado = await apagarPontos(selecionados);
  //   if(resultado.success) {
  //     const ids = new Set(selecionados.filter((item) => item.id ?? false).map((item) => item.id))
  //     setRegistrados((atuais) => {
  //       return atuais.filter((atual) => !ids.has(atual.id));
  //     });
  //     setSelecionados([]);
  //   }
  // }

  if(!cidade) {
    return (
      <p>Não foi possível exibir informações sobre a cidade no momento</p>
    )
  }

  
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="font-title mt-3 text-2xl text-center">{cidade.nome} - {cidade.uf}</h1>
      <BusStopManager cidade={cidade}/>
    </div>
  )
}