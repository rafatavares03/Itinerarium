'use client'

import { getBusLinesAction, CreateBusLineState } from "../actions/busLineActions";
import { CidadeDetails } from "@/types/cidade"
import { BusLineBasic } from "@/types/busLine";
import { useEffect, useState } from "react";

export default function BusLineList({
  city,
  onClick
}: {
  city: CidadeDetails | null,
  onClick: (line: BusLineBasic) => void
}) {
  const [busLines, setBusLines] = useState<BusLineBasic[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if(!city) return;
      const res = await getBusLinesAction(city.id, {});
      if(res.success) {
        setBusLines(res.data ?? []);
      }
    }

    loadData();
  }, [city])

  if(busLines.length === 0) {
    return <p>Não há linhas disponíveis</p>
  }
  
  return (
    <div className="flex flex-wrap gap-5 m-5">
      {busLines.map((busLine) => 
        <div key={busLine.id} 
          onClick={() => onClick(busLine)}
          className="bg-space-indigo-700 h-[150px] w-[200px] rounded-xl flex flex-col 
                      shadow-[0_10px_10px_3px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-105
                      "
        >
          <div className="flex-1 flex justify-center items-center font-bold text-center">
            <p className="text-dusty-grape-100 text-xl">{busLine.codigo}</p>
          </div>
          <p className="bg-icy-aqua-400 rounded-b-xl font-semibold text-center">
            {busLine.origem} - {busLine.destino}
          </p>
        </div>
      )}
    </div>
  )
}