import { useEffect, useState } from "react";
import { Ponto } from "@/types/ponto";
import PontosList from "./PontosList";
import PontoDetails from "@/app/components/pontoInfo";
import { RiSave3Fill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import Pagination from "@/app/components/pagination";
import { getBusStopsAction } from "../actions/busStopActions";

enum Abas {
  registrados = "REGISTRADOS",
  selecionados = "SELECIONADOS",
  novos = "NOVOS"
}

export default function PontosMenu({
  cidadeId,
  ponto,
  registrados,
  novos,
  selecionados,
  emCadastro,
  paginas,
  registradosTotais,
  onPageChange,
  onSetFocus,
  onDelete,
  onUpdate,
  onSave
}: {
  cidadeId: number,
  ponto: Ponto | null,
  registrados: Ponto[],
  novos: Ponto[],
  selecionados: Ponto[],
  emCadastro: boolean
  paginas: {atual: number, total: number}
  registradosTotais: number,
  onPageChange: (p: number) => void,
  onSetFocus: (ponto: Ponto | null) => void,
  onDelete: () => void,
  onUpdate: (antigo: Ponto, novo: Ponto) => void
  onSave: () => void
}) {
  const [abaAtiva, setAbaAtiva] = useState<Abas>(Abas.registrados);
  const [busca, setBusca] = useState("");
  const [resultadoBusca, setResultadoBusca] = useState<Ponto[]>([]);
  const [paginasBusca, setPaginasBusca] = useState({
    atual: 1,
    total: 1
  });
  const buscando = busca.trim().length > 0;
  const abaStyle = "transition-all hover:border-b-3"
  const abaAtivaStyle = "text-base font-bold text-icy-aqua-700 border-b-3 border-icy-aqua-700";

  useEffect(() => {
    if(emCadastro && ponto) {
      setAbaAtiva(Abas.novos);
    }
  }, [emCadastro, ponto])

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if(busca.trim().length === 0) return;
      const resposta = await getBusStopsAction({city: cidadeId, amount: 15, page: paginasBusca.atual, address: busca, pagination: true});

      if(resposta.success) {
        setResultadoBusca(resposta.data?.busStops ?? []);
        setPaginasBusca({
          atual: paginasBusca.atual,
          total: resposta.data?.pagesAmount ?? 1
        });
      }
    }, 500)

    return () => clearTimeout(timeout);
  }, [busca, paginasBusca.atual]);

  function atualizaPaginaBusca(pagina: number) {
    setPaginasBusca({
      atual: pagina,
      total: paginasBusca.total
    })
  }

  function getList(aba: Abas): Ponto[]{
    switch(aba){
      case Abas.registrados:
        return registrados
      case Abas.novos:
        return novos
      case Abas.selecionados:
        return selecionados
    }
  }

  return (
    <div className="flex flex-col justify-between h-full relative w-3xl" >
      <div>
        <div className="flex justify-center gap-2 text-xs uppercase">
          {Object.values(Abas).map((aba) => {
            return (
              <button key={aba} type="button" 
                className={(abaAtiva === aba) ? abaStyle.concat(" " + abaAtivaStyle) : abaStyle}
                onClick={() => { 
                  onSetFocus(null)
                  setAbaAtiva(aba)
                }}
              >
                {aba} <em className="italic font-thin text-xs">({aba === Abas.registrados ? registradosTotais : getList(aba).length})</em>
              </button>
            )
          })}
        </div>
      </div>
      {getList(abaAtiva).length === 0 ?  
        <p className="flex-1 p-5 text-center text-sm">Não há pontos de ônibus para exibir na área "<em className="lowercase">{abaAtiva}</em>".</p> :
        ponto === null ?
          <>
            {abaAtiva === Abas.registrados && 
              <div className="px-2 mt-1">
              <input type="text" name="search" id="search"
                className="bg-space-indigo-700 outline-0 text-white text-sm py-1 px-3 w-full"
                placeholder="Pesquisar ponto de ônibus"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                />
              </div>
            }
            <PontosList 
              pontos={(!buscando) ? getList(abaAtiva) : resultadoBusca} 
              onClick={(ponto:Ponto) => onSetFocus(ponto)}
            /> 
            {abaAtiva === Abas.registrados && 
              <Pagination 
                quantidade={(!buscando) ? paginas.total : paginasBusca.total} 
                pagina={(!buscando) ? paginas.atual : paginasBusca.atual} 
                onChange={(!buscando) ? onPageChange : atualizaPaginaBusca}
              />
            }
            {abaAtiva === Abas.novos && 
              <button type="button" 
                onClick={onSave}
                className="bg-icy-aqua-800 cursor-pointer font-display font-bold flex justify-center items-center gap-2 rounded-b-2xl py-3 text-icy-aqua-400 shadow-[0_-10px_0px_#fff]"
              >
               <RiSave3Fill size={"25px"}/> Salvar
              </button>
            }
            {abaAtiva === Abas.selecionados &&
              <button type="button"
                onClick={onDelete}
                className="bg-red-500 cursor-pointer font-display font-bold flex justify-center items-center gap-2 rounded-b-2xl py-3 text-white shadow-[0_-10px_0px_#fff]"
              >
                <MdDelete size={"25px"}/> Apagar
              </button>
            }
          </> :
          <PontoDetails ponto={ponto} 
            onClose={() => onSetFocus(null)} 
            onUpdate={(antigo: Ponto, novo: Ponto) => {
              onUpdate(antigo, novo);
              onSetFocus(null);
            }}
            {...(abaAtiva === Abas.novos) ? {toUpdate: true} : {}}
          />
      }
    </div>
  )
}