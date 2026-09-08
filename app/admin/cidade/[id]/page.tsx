'use client'

import { buscaCidadePorId } from "@/lib/service/cidadeService";
import { use, useEffect, useState } from "react";
import { CidadeDetails } from "@/types/cidade";
import dynamic from "next/dynamic";
import { CiCirclePlus } from "react-icons/ci";
import { Ponto } from "@/types/ponto";
import { salvarPontos, apagarPontos } from "@/lib/service/pontoService";
import { MdDelete } from "react-icons/md";
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
  const [pontosSelecionados, setPontosSelecionados] = useState<Ponto[]>([]);
  const [adicionar, setAdicionar] = useState(false);
  const [pontoHover, setPontoHover] = useState<Ponto | null>(null);
  const [pontoEditando, setPontoEditando] = useState<Ponto | null>(null);
  const [novoEndereco, setNovoEndereco] = useState("");

  const [registrados, setRegistrados] = useState<Ponto[]>([]);
  const [selecionados, setSelecionados] = useState<Ponto[]>([]);
  const [novos, setNovos] = useState<Ponto[]>([])

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
    console.log("coordenadas:", latitude, longitude);
    if(!cidade) return;

    const novoPonto: Ponto = {
      cidade_id: cidade.id,
      coordenada: [latitude, longitude],
      endereco: "",
    };

    setNovos((pontosAtuais) => {
      const jaExiste = pontosAtuais.some((ponto) =>
          ponto.coordenada[0] === novoPonto.coordenada[0] &&
          ponto.coordenada[1] === novoPonto.coordenada[1]
      );
      console.log(jaExiste);
      if (jaExiste) {
        return pontosAtuais;
      }
      

      return [...pontosAtuais, novoPonto];
    });

    console.log(novos);
    setPontoEditando(novoPonto)
    setNovoEndereco("")
  }

  function selecionaPonto(ponto: Ponto) {
    setPontosSelecionados((selecionados) => {
      if(selecionados.some(p => (p.coordenada[0] === ponto.coordenada[0]) && (p.coordenada[1] === ponto.coordenada[1]))) {
        return selecionados.filter((p) => (p.coordenada[0] != ponto.coordenada[0]) && (p.coordenada[1] != ponto.coordenada[1]));
      }

      return [...selecionados, ponto]
    })

    setSelecionados((selecionados) => {
      if(selecionados.some(p => (p.coordenada[0] === ponto.coordenada[0]) && (p.coordenada[1] === ponto.coordenada[1]))) {
        return selecionados.filter((p) => (p.coordenada[0] != ponto.coordenada[0]) && (p.coordenada[1] != ponto.coordenada[1]));
      }

      return [...selecionados, ponto];
    })
  }

  function pontoSelecionado(ponto: Ponto) {
    return pontosSelecionados.some(p => p.coordenada[0] === ponto.coordenada[0] && p.coordenada[1] === ponto.coordenada[1])
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

  async function SalvaPontos() {
    const resultado = await salvarPontos(novos);
    if(resultado.success) {
      window.location.reload();
    }
    console.log(resultado);
  }

  async function ApagarPontos() {
    const resultado = await apagarPontos(pontosSelecionados);
    if(resultado.success) {
      window.location.reload();
    }
    console.log(resultado);
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
        <button type="button" 
          className={"bg-red-500 " + buttonStyle}
          onClick={() => ApagarPontos()}
        >
          <MdDelete className="size-[30px]"/>
          Apagar
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
          pontoHover={pontoHover}
          />
        <PontosMenu registrados={registrados} selecionados={selecionados} novos={novos} onUpdate={editarPonto} onSave={adicionarPontos}/>
      </div>
    </div>
  )
}