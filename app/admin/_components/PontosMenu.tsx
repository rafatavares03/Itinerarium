import { useState } from "react";
import { Ponto } from "@/types/ponto";
import PontosList from "./PontosList";

enum Aba {
  registrados = "REGISTRADOS",
  selecionados = "SELECIONADOS",
  novos = "NOVOS"
}

export default function PontosMenu({
  registrados,
  novos,
  selecionados
}: {
  registrados: Ponto[],
  novos: Ponto[],
  selecionados: Ponto[]
}) {
  const [abaAtiva, setAbaAtiva] = useState<Aba>(Aba.registrados);
  const abaStyle = "transition-all hover:border-b-3"
  const abaAtivaStyle = "text-base font-bold text-icy-aqua-700 border-b-3 border-icy-aqua-700";

  function getList(aba: Aba) {
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
                onClick={() => setAbaAtiva(aba)}
              >
                {aba} <em className="italic font-thin text-xs">({getList(aba).length})</em>
              </button>
            )
          })}
        </div>
      </div>
      <PontosList pontos={getList(abaAtiva)} />
    </div>
  )
}