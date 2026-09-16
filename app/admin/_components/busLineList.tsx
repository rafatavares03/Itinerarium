'use client'

import { getBusLinesAction, CreateBusLineState } from "../actions/busLineActions";
import { CidadeDetails } from "@/types/cidade"
import { LinhaBasic } from "@/types/linha";
import { useEffect, useState } from "react";

export default function BusLineList({
  city
}: {
  city: CidadeDetails | null
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
    <div>
      {busLines.map((busLine) => <p key={busLine.id}>{busLine.nome}</p>)}
    </div>
  )
}