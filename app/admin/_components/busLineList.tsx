'use client'

import { getBusLinesAction, CreateBusLineState } from "../actions/busLineActions";
import { CidadeDetails } from "@/types/cidade"
import { LinhaBasic } from "@/types/linha";
import { useEffect, useState } from "react";

export default function BusLineList({
  city,
  onClick
}: {
  city: CidadeDetails | null,
  onClick: (line: LinhaBasic) => void
}) {
  const [busLines, setBusLines] = useState<LinhaBasic[]>([]);

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
        <div key={busLine.id} onClick={() => onClick(busLine)}>
          <div className="font-bold text-center">{busLine.codigo}</div>
          <p>{busLine.nome}</p>
        </div>
      )}
    </div>
  )
}