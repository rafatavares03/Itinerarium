'use client'

import { buscaCidadePorId } from "@/lib/service/cidadeService";
import { use, useEffect, useState } from "react";
import { CidadeDetails } from "@/types/cidade";
import dynamic from "next/dynamic";
import { CiCirclePlus } from "react-icons/ci";
import { Ponto } from "@/types/ponto";
import { salvarPontos, apagarPontos } from "@/lib/service/pontoService";
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
  const [adicionar, setAdicionar] = useState(false);
  
  const [ponto, setPonto] = useState<Ponto | null>(null);
  const [registrados, setRegistrados] = useState<Ponto[]>([]);
  const [selecionados, setSelecionados] = useState<Ponto[]>([]);
  const [novos, setNovos] = useState<Ponto[]>([]);
  const [edicao, setEdicao] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      const resposta = await buscaCidadePorId(parseInt(id));
      if(resposta.success) {
        console.log(resposta.dados?.pontos);
        setCidade(resposta.dados?.cidade ?? null);
        setRegistrados(resposta.dados?.pontos ?? []);
      }
    }
    carregarDados();
  }, []);

  function MapClick(latitude: number, longitude: number) {
    if (!cidade) return;

    const novoPonto: Ponto = {
      cidade_id: cidade.id,
      coordenada: [latitude, longitude],
      logradouro: "",
      numero: ""
    };

    const existe = novos.some(p =>
      comparaPontoPorCoordenada(p, novoPonto)
    );

    if (existe) {
      return;
    }

    setPonto(novoPonto);
    setEdicao(true);
    setNovos(pontosAtuais => [...pontosAtuais, novoPonto]);
  }

  function comparaPontoPorCoordenada(p1: Ponto, p2: Ponto) {
    return (p1.coordenada[0] === p2.coordenada[0]) && (p1.coordenada[1] === p2.coordenada[1]);
  }

  function adicionaPontoEmDestaque(p: Ponto) {
    setPonto((atual) => {
      if(!atual) {
        return p;
      }

      return comparaPontoPorCoordenada(atual, p) ? null : p;
    });
  }

  function selecionaPonto(ponto: Ponto) {
    if(!ponto.id) {
      adicionaPontoEmDestaque(ponto);
      return;
    }

    setSelecionados((selecionados) => {
      if(selecionados.some(p => comparaPontoPorCoordenada(p, ponto))) {
        return selecionados.filter((p) => !comparaPontoPorCoordenada(p, ponto));
      }

      return [...selecionados, ponto];
    })

    adicionaPontoEmDestaque(ponto);
  }

  function pontoSelecionado(ponto: Ponto) {
    return selecionados.some(p => p.coordenada[0] === ponto.coordenada[0] && p.coordenada[1] === ponto.coordenada[1])
  }

  function pontoDestacado(p: Ponto) {
    if(!ponto) return false;
    return (ponto.coordenada[0] === p.coordenada[0] && ponto.coordenada[1] === p.coordenada[1]);
  }

  async function editarPonto(antigo: Ponto, novo: Ponto) {
    if(!antigo.id) {
      setNovos((novos) => 
        novos.map(ponto => 
          (ponto.coordenada[0] === antigo.coordenada[0] && ponto.coordenada[1] === antigo.coordenada[1]) ? novo : ponto
        )
      );
    } else {

      
      const resultado = await salvarPontos(new Array(novo));
      if(resultado.success) {
        setRegistrados((registrados) => 
          registrados.map(ponto => ponto.id === novo.id ? novo : ponto)
        );
      }
    }
  }

  async function adicionarPontos() {
    const resultado = await salvarPontos(novos);
    if(resultado.success) {
      setRegistrados((pontos) => [
        ...pontos,
        ...resultado.data
      ])
      setNovos([]);
    }
  }

  async function excluirPontos() {
    const resultado = await apagarPontos(selecionados);
    if(resultado.success) {
      const ids = new Set(selecionados.filter((item) => item.id ?? false).map((item) => item.id))
      setRegistrados((atuais) => {
        return atuais.filter((atual) => !ids.has(atual.id));
      })
      setSelecionados([]);
    }
  }

  if(!cidade) {
    return (
      <p>Não foi possível exibir informações sobre a cidade no momento</p>
    )
  }

  const buttonStyle = "px-5 py-1 flex items-center gap-2 font-bold text-white rounded-sm"

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="font-title mt-3 text-2xl text-center">{cidade.nome} - {cidade.uf}</h1>
      <div className="flex">
        <button type="button" 
          className={((adicionar) ? "bg-red-500 " : "bg-lime-500 ") + buttonStyle}
          onClick={() => setAdicionar(!adicionar)}
          >
          <CiCirclePlus className="size-[30px]"/>
          {(adicionar)? "Desabilitar" : "Adicionar"}
        </button>
      </div>
      <div className="bg-slate-50 flex h-130 w-full p-1">
        <CidadeMap 
          bounds={cidade.enquadramento}
          pontos={registrados} 
          novos={novos}
          onMapClick={MapClick}
          adicionarPontos={adicionar}
          onSelectPoint={selecionaPonto}
          isPointSelected={pontoSelecionado}
          isPointHighlighted={pontoDestacado}
          pontoDestaque={ponto}
          />
        <PontosMenu 
          registrados={registrados} 
          selecionados={selecionados} 
          novos={novos}
          ponto={ponto}
          emCadastro={edicao}
          onClick={(ponto) => setPonto(ponto)}
          onDelete={excluirPontos}
          onUpdate={editarPonto} 
          onSave={adicionarPontos}
          />
      </div>
    </div>
  )
}