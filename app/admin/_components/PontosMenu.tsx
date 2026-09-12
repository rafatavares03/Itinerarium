import { useEffect, useState } from "react";
import { Ponto } from "@/types/ponto";
import PontosList from "./PontosList";
import PontoDetails from "@/app/components/pontoDetails";
import { RiSave3Fill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import Paginacao from "@/app/components/paginacao";

enum Aba {
  registrados = "REGISTRADOS",
  selecionados = "SELECIONADOS",
  novos = "NOVOS"
}

export default function PontosMenu({
  ponto,
  registrados,
  novos,
  selecionados,
  emCadastro,
  pagina,
  quantidadePaginas,
  registradosTotais,
  onPageChange,
  onSetFocus,
  onDelete,
  onUpdate,
  onSave
}: {
  ponto: Ponto | null,
  registrados: Ponto[],
  novos: Ponto[],
  selecionados: Ponto[],
  emCadastro: boolean,
  pagina: number,
  quantidadePaginas: number,
  registradosTotais: number,
  onPageChange: (p: number) => void,
  onSetFocus: (ponto: Ponto | null) => void,
  onDelete: () => void,
  onUpdate: (antigo: Ponto, novo: Ponto) => void
  onSave: () => void
}) {
  const [abaAtiva, setAbaAtiva] = useState<Aba>(Aba.registrados);
  const abaStyle = "transition-all hover:border-b-3"
  const abaAtivaStyle = "text-base font-bold text-icy-aqua-700 border-b-3 border-icy-aqua-700";

  useEffect(() => {
    if(emCadastro && ponto) {
      setAbaAtiva(Aba.novos);
    }
  }, [emCadastro, ponto])

  function getList(aba: Aba): Ponto[]{
    switch(aba){
      case Aba.registrados:
        return registrados
      case Aba.novos:
        return novos
      case Aba.selecionados:
        return selecionados
    }
  }

  return (
    <div className="flex flex-col justify-between h-full relative w-3xl" >
      <div>
        <div className="flex justify-center gap-2 text-xs uppercase">
          {Object.values(Aba).map((aba) => {
            return (
              <button key={aba} type="button" 
                className={(abaAtiva === aba) ? abaStyle.concat(" " + abaAtivaStyle) : abaStyle}
                onClick={() => { 
                  onSetFocus(null)
                  setAbaAtiva(aba)
                }}
              >
                {aba} <em className="italic font-thin text-xs">({aba === Aba.registrados ? registradosTotais : getList(aba).length})</em>
              </button>
            )
          })}
        </div>
      </div>
      {getList(abaAtiva).length === 0 ?  
        <p className="flex-1 p-5 text-center text-sm">Não há pontos de ônibus para exibir na área "<em className="lowercase">{abaAtiva}</em>".</p> :
        ponto === null ?
          <>
            <PontosList pontos={getList(abaAtiva)} onClick={(ponto:Ponto) => onSetFocus(ponto)}/> 
            {abaAtiva === Aba.registrados && 
              <Paginacao quantidade={quantidadePaginas} pagina={pagina} onChange={onPageChange}/>
            }
            {abaAtiva === Aba.novos && 
              <button type="button" 
                onClick={onSave}
                className="bg-icy-aqua-800 cursor-pointer font-display font-bold flex justify-center items-center gap-2 rounded-b-2xl py-3 text-icy-aqua-400 shadow-[0_-10px_0px_#fff]"
              >
               <RiSave3Fill size={"25px"}/> Salvar
              </button>
            }
            {abaAtiva === Aba.selecionados &&
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
            {...(abaAtiva === Aba.novos) ? {toUpdate: true} : {}}
          />
      }
    </div>
  )
}