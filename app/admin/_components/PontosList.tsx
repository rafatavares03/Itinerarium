'use client'

import { Ponto } from "@/types/ponto";

export default function PontosList({
  pontos,
  onClick
}: {
  pontos: Ponto[]
  onClick: (ponto: Ponto) => void
}) {
  return (
    <ul className="flex flex-col flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-2 gap-2">
        {pontos.map((ponto) => {
          return (
            <li key={ponto.coordenada.toString()} 
              onClick={() => onClick(ponto)}
              className="bg-space-indigo-800 border p-2 text-sm transition-all ease-in-out 
                hover:text-base hover:border-icy-aqua-500">
              <p className="font-main text-icy-aqua-50">{(!ponto.endereco || ponto.endereco.trim().length === 0) ? ponto.coordenada.toString() : ponto.endereco}</p>
            </li>
          );
        })}
    </ul>
  );
}