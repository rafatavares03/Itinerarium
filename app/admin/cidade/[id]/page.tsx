'use client'

import { use, useEffect, useState } from "react";
import { CidadeDetails } from "@/types/cidade";
import { Ponto } from "@/types/ponto";
import BusStopManager from "@/app/admin/_components/busStopManager";
import BusLineContainer from "@/app/admin/_components/busLineContainer";
import BusLineManager from "../../_components/busLineManager";
import { JSX } from "react";
import { getCityAction } from "../../actions/cityActions";
import { getBusStopsAction } from "../../actions/busStopActions";

enum Abas {
  pontos = "Pontos",
  linhas = "Linhas",
}

export default function City({
  params,
}: {
  params: Promise<{id: string}>
}) {
  const {id} = use(params);
  const [city, setCity] = useState<CidadeDetails | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<Abas>(Abas.pontos);
  const [mode, setMode] = useState<"list" | "add">("list");
  const [busStops, setBusStops] = useState<Ponto[]>([]);
  const componentMap: Record<Abas, () => JSX.Element> = {
    [Abas.pontos]: () => <BusStopManager city={city} busStops={busStops} onChangeBusStops={setBusStops}/>,
    [Abas.linhas]: () => (mode === "list") ? 
                            <BusLineContainer city={city} onAddClick={() => setMode("add")}/> : 
                            <BusLineManager city={city} onBackClick={() => setMode("list")}/>
  }
  const ComponenteSelecionado = componentMap[abaAtiva];

  useEffect(() => {
    setMode("list");
  }, [abaAtiva]);

  useEffect(() => {
    const loadData = async () => {
      const [city, busStops] = await Promise.all([
        getCityAction(parseInt(id)),
        getBusStopsAction({city: parseInt(id)})
      ])

      if(city.success) {
        setCity(city.data?.city ?? null)
      }

      if(busStops.success) {
        setBusStops(busStops.data?.busStops ?? []);
      }

    }
    loadData();
  }, []);

  if(!city) {
    return (
      <p>Não foi possível exibir informações sobre a cidade no momento</p>
    )
  }

  
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="font-title mt-3 text-2xl text-center">{city.nome} - {city.uf}</h1>
      <div>
        <button type="button" onClick={() => setAbaAtiva(Abas.pontos)}>Pontos</button>
        <button type="button" onClick={() => setAbaAtiva(Abas.linhas)}>Linhas</button>
      </div>
      <ComponenteSelecionado />
    </div>
  )
}