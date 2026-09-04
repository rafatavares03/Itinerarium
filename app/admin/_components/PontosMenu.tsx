import { useState } from "react";
import { Ponto } from "@/types/ponto";

enum Aba {
  todos = "TODOS",
  selecionados = "SELECIONADOS",
  novos = "NOVOS"
}

export default function PontosMenu({
  pontos
}: {
  pontos: Ponto[]
}) {
  const [abaAtiva, setAbaAtiva] = useState<Aba>(Aba.todos);
  const abaStyle = "transition-all hover:border-b-3"
  const abaAtivaStyle = "text-base font-bold text-icy-aqua-700 border-b-3 border-icy-aqua-700";

  return (
    <div className="flex flex-col h-full w-lg" >
      <div>
        {/* <h1 className="font-display font-semibold text-center">Pontos</h1> */}
        <div className="flex justify-center gap-2 text-xs uppercase">
          {Object.values(Aba).map((aba) => {
            return (
              <button key={aba} type="button" 
                className={(abaAtiva === aba) ? abaStyle.concat(" " + abaAtivaStyle) : abaStyle}
                onClick={() => setAbaAtiva(aba)}
              >
                {aba}
              </button>
            )
          })}
        </div>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden p-2 gap-2">
        {pontos.map((ponto) => {
          return (
            <div key={ponto.coordenada.toString()} 
              className="bg-space-indigo-800 border p-2 text-sm transition-all ease-in-out 
                hover:text-base hover:border-icy-aqua-500">
              <p className="font-main text-icy-aqua-50">{ponto.endereco ?? ponto.coordenada.toString()}</p>
            </div>
          );
        })}
      </div>
    </div>
  )
}