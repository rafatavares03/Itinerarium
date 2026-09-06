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
  const [pontoEmEdicao, setPontoEmEdicao] = useState<Ponto | null>(null);

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

  const labelStyle = "font-main font-semibold text-sm text-space-indigo-700"
  const inputStyle = "bg-space-indigo-700 text-icy-aqua-100 font-display px-3 py-2 mt-2 mb-5 outline-0"

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
                  setPontoEmEdicao(null)
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
        pontoEmEdicao === null ?
          <PontosList pontos={getList(abaAtiva)} onClick={(ponto:Ponto) => setPontoEmEdicao(ponto)}/> :
          <form className="flex flex-col px-5">
            <h1 className="font-display font-semibold text-center p-5">Editar ponto</h1>
            <label htmlFor="endereco" className={labelStyle}>Endereço</label>
            <input type="text" name="endereco" id="endereco" defaultValue={pontoEmEdicao.endereco ?? ''} className={inputStyle}/>
            <label htmlFor="latitude" className={labelStyle}>Latitude</label>
            <input type="text" name="latitude" id="latitude" defaultValue={pontoEmEdicao.coordenada[0]} className={inputStyle}/>
            <label htmlFor="Longitude" className={labelStyle}>Longitude</label>
            <input type="text" name="longitude" id="longitude" defaultValue={pontoEmEdicao.coordenada[1]} className={inputStyle}/>
          </form>
      }
    </div>
  )
}