import { useState } from "react";
import { Ponto } from "@/types/ponto";
import PontosList from "./PontosList";
import PontoDetails from "@/app/components/pontoDetails";

enum Aba {
  registrados = "REGISTRADOS",
  selecionados = "SELECIONADOS",
  novos = "NOVOS"
}

export default function PontosMenu({
  registrados,
  novos,
  selecionados,
  onUpdate
}: {
  registrados: Ponto[],
  novos: Ponto[],
  selecionados: Ponto[],
  onUpdate: (antigo: Ponto, novo: Ponto) => void
}) {
  const [abaAtiva, setAbaAtiva] = useState<Aba>(Aba.registrados);
  const abaStyle = "transition-all hover:border-b-3"
  const abaAtivaStyle = "text-base font-bold text-icy-aqua-700 border-b-3 border-icy-aqua-700";
  const [ponto, setPonto] = useState<Ponto | null>(null);

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
    <div className="flex flex-col h-full w-3xl" >
      <div>
        {/* <h1 className="font-display font-semibold text-center">Pontos</h1> */}
        <div className="flex justify-center gap-2 text-xs uppercase">
          {Object.values(Aba).map((aba) => {
            return (
              <button key={aba} type="button" 
                className={(abaAtiva === aba) ? abaStyle.concat(" " + abaAtivaStyle) : abaStyle}
                onClick={() => { 
                  setPonto(null)
                  setAbaAtiva(aba)
                }}
              >
                {aba} <em className="italic font-thin text-xs">({getList(aba).length})</em>
              </button>
            )
          })}
        </div>
      </div>
      {getList(abaAtiva).length === 0 ?  
        <p className="p-5 text-center text-sm">Não há pontos de ônibus para exibir na área "<em className="lowercase">{abaAtiva}</em>".</p> :
        ponto === null ?
          <PontosList pontos={getList(abaAtiva)} onClick={(ponto:Ponto) => setPonto(ponto)}/> :
          <PontoDetails ponto={ponto} 
            onClose={() => setPonto(null)} 
            onUpdate={(antigo: Ponto, novo: Ponto) => {
              onUpdate(antigo, novo);
              setPonto(null);
            }}
            {...(abaAtiva === Aba.novos) ? {toUpdate: true} : {}}
          />
      }
    </div>
  )
}