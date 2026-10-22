'use client'

import { use, useEffect, useState } from "react";
import BusStopManager from "@/app/(administracao)/_components/busStopManager";
import BusLineContainer from "@/app/(administracao)/_components/busLineContainer";
import BusLineManager from "@/app/(administracao)/_components/busLineManager";
import { JSX } from "react";
import { getCityAction } from "@/app/actions/cityActions";
import { getBusStopsAction } from "@/app/actions/busStopActions";
import { BusLineBasic } from "@/types/busLine";
import { useSession } from "next-auth/react";
import { useCityData } from "@/app/hooks/useCityData";

enum Abas {
  pontos = "Pontos",
  linhas = "Linhas",
}

export default function City() {
  const { data: session, status } = useSession();
  console.log("STATUS DA SESSÃO:", status);
console.log("DADOS DA SESSÃO:", session);
  const cityId = session?.user?.city;
  const [abaAtiva, setAbaAtiva] = useState<Abas>(Abas.pontos);
  const [mode, setMode] = useState<"list" | "add">("list");
  const [line, setLine] = useState<BusLineBasic | null>(null);
  const { city, setCity, busStops, setBusStops, loading, error } = useCityData(cityId);
  const componentMap: Record<Abas, () => JSX.Element> = {
    [Abas.pontos]: () => <BusStopManager city={city} busStops={busStops} onChangeBusStops={setBusStops}/>,
    [Abas.linhas]: () => (mode === "list") ? 
                            <BusLineContainer city={city} 
                              onAddClick={() => {
                                setLine(null);
                                setMode("add");
                              }}
                              onLineClick={(line: BusLineBasic) => {
                                setLine(line);
                                setMode("add")
                              }}
                            /> : 
                            <BusLineManager city={city} 
                              onBackClick={() => setMode("list")} 
                              line={line}
                              busStops={busStops}
                            />,
  }
  const ComponenteSelecionado = componentMap[abaAtiva];

  useEffect(() => {
    setMode("list");
  }, [abaAtiva]);

  useEffect(() => {
    const loadData = async () => {
      const [city, busStops] = await Promise.all([
        getCityAction(parseInt(cityId)),
        getBusStopsAction({city: parseInt(cityId)})
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

  const selectedWindow = "bg-space-indigo-700 font-bold text-white w-full";
  const windowButtonStyle = "bg-white text-space-indigo-700 w-full"

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="font-title mt-3 text-2xl text-center">{city.nome} - {city.uf}</h1>
      <div className="border-1 border-space-indigo-700 w-[500px] flex justify-around">
        {Object.entries(Abas).map(([key, value]) => (
          <button key={value} 
            onClick={() => setAbaAtiva(Abas[key as keyof typeof Abas])} 
            className={(abaAtiva === Abas[key as keyof typeof Abas]) ? selectedWindow : windowButtonStyle}
            type="button">
            {value}
          </button>
        ))}
      </div>
      <ComponenteSelecionado />
    </div>
  )
}