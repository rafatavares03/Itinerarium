'use client'

import { getBusLinesAction, CreateBusLineState } from "../../actions/busLineActions";
import { CidadeDetails } from "@/types/cidade"
import { BusLineBasic } from "@/types/busLine";
import { useEffect, useState } from "react";
import BusLineCard from "../../components/busLineCard";

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
        <BusLineCard key={busLine.id} busLine={busLine} onClick={() => onClick(busLine)}/>
      )}
    </div>
  )
}