'use client'

import { useEffect, useState } from "react";
import { Ponto } from "@/types/ponto";
import { CidadeDetails } from "@/types/cidade";
import { CiCirclePlus } from "react-icons/ci";
import PontosMenu from "@/app/admin/_components/PontosMenu";
import dynamic from "next/dynamic";
import { apagarPontos, buscarPontos, salvarPontos } from "@/lib/services/busStopService";

const CidadeMap = dynamic(
  () => import("@/app/components/cidadeMap"),
  {
    ssr: false,
  }
);

export default function BusStopManager({
  city
}: {
  city: CidadeDetails | null
}) {
  const [registrados, setRegistrados] = useState<Ponto[]>([]);
  const [selecionados, setSelecionados] = useState<Ponto[]>([]);
  const [novos, setNovos] = useState<Ponto[]>([]);
  const [pontosMapa, setPontosMapa] = useState<Ponto[]>([]);
  const [adicionar, setAdicionar] = useState(false);
  const [pontoEmFoco, setPontoEmFoco] = useState<Ponto | null>(null);
  const [edicao, setEdicao] = useState(false);
  const [paginas, setPaginas] = useState({
    atual: 1,
    total: 1
  });

  useEffect(() => { 
    const carregarPontos = async () => {
      if(!city) return;
      const [todosPontos, pontosDoMenu] = await Promise.all([
        buscarPontos(city.id, {}),
        buscarPontos(city.id, {quantidade: 15, pagina: paginas.atual})
      ]) 
      if(todosPontos.success) {
        setPontosMapa(todosPontos.data?.pontos ?? []);
      }
      if(pontosDoMenu.success) { 
        setRegistrados(pontosDoMenu.data?.pontos ?? []); 
        setPaginas({
          atual: paginas.atual,
          total: pontosDoMenu.data?.quantidadePaginas ?? 1
        })
      }} 
      
    carregarPontos(); 
  }, [city, paginas.atual, pontosMapa.length]);

  function comparaPontoPorCoordenada(p1: Ponto, p2: Ponto) {
    return (p1.coordenada[0] === p2.coordenada[0]) && (p1.coordenada[1] === p2.coordenada[1]);
  }

  function MapClick(latitude: number, longitude: number) {
    if(!city) return;

    const novoPonto: Ponto = {
      cidade_id: city.id,
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

    setPontoEmFoco(novoPonto);
    setEdicao(true);
    setNovos(pontosAtuais => [...pontosAtuais, novoPonto]);
  }

  function adicionaPontoEmDestaque(p: Ponto) {
    setPontoEmFoco((atual) => {
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

    if(!ponto.id) {
      adicionaPontoEmDestaque(ponto);
    } else {
      setEdicao(false);
    }
  }
  
  function apagaNovo(ponto: Ponto){
    setNovos((atuais) => {
      return atuais.filter((p) => !comparaPontoPorCoordenada(p, ponto));
    });
    if(pontoEmFoco && comparaPontoPorCoordenada(ponto, pontoEmFoco)) {
      setPontoEmFoco(null);
      setEdicao(false);
    }
  }

  function pontoSelecionado(ponto: Ponto) {
    return selecionados.some(p => p.coordenada[0] === ponto.coordenada[0] && p.coordenada[1] === ponto.coordenada[1])
  }

  function pontoDestacado(ponto: Ponto) {
    if(!pontoEmFoco) return false;
    return comparaPontoPorCoordenada(ponto, pontoEmFoco);
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
        setPontosMapa((registrados) => 
          registrados.map(ponto => ponto.id === novo.id ? novo : ponto)
        );
      }
    }
  }

  async function adicionarPontos() {
    const resultado = await salvarPontos(novos);
    if(resultado.success) {
      setPontosMapa((pontos) => [
        ...pontos,
        ...resultado.data
      ])
      setNovos([]);
      setPontoEmFoco(null);
      setEdicao(false);
    }
  }

  async function excluirPontos() {
    const resultado = await apagarPontos(selecionados);
    if(resultado.success) {
      const ids = new Set(selecionados.filter((item) => item.id ?? false).map((item) => item.id))
      setRegistrados((atuais) => {
        return atuais.filter((ponto) => !ids.has(ponto.id));
      });
      setPontosMapa((atuais) => {
        return atuais.filter((ponto) => !ids.has(ponto.id))
      })
      setSelecionados([]);
    }
  }

  if(!city) {
    return (
      <p>Dados da cidade indisponíveis no momento.</p>
    );
  }

  const buttonStyle = "px-5 py-1 flex items-center gap-2 font-bold text-white rounded-sm";

  return (
    <div className="bg-slate-50 flex h-140 w-full p-1">
        <div className="relative w-full">
          <div className="flex">
            <button type="button" 
              className={((adicionar) ? "bg-red-500 " : "bg-lime-500 ") + buttonStyle + " absolute top-1 right-1 z-1000"}
              onClick={() => {console.log(pontoEmFoco); setAdicionar(!adicionar)}}
              >
              <CiCirclePlus className="size-[30px]"/>
              {(adicionar)? "Desabilitar inserção" : "Habilitar inserção"}
            </button>
          </div>
          <CidadeMap 
            bounds={city.enquadramento}
            pontos={pontosMapa} 
            novos={novos}
            onMapClick={MapClick}
            adicionarPontos={adicionar}
            onSelectPoint={selecionaPonto}
            onDeleteNew={apagaNovo}
            isPointSelected={pontoSelecionado}
            isPointHighlighted={pontoDestacado}
            pontoDestaque={pontoEmFoco}
          />
        </div>
        <PontosMenu 
          cidadeId={city.id}
          registrados={registrados} 
          selecionados={selecionados} 
          novos={novos}
          ponto={pontoEmFoco}
          emCadastro={edicao}
          paginas = {paginas}
          registradosTotais={pontosMapa.length}
          onPageChange={(p:number) => setPaginas({
            total: paginas.total,
            atual: p
          })}
          onSetFocus={(ponto) => {
            setPontoEmFoco(ponto);
            if(!ponto) setEdicao(false);
          }}
          onDelete={excluirPontos}
          onUpdate={editarPonto} 
          onSave={adicionarPontos}
          />
      </div>
  );
}