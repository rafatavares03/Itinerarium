"use client"

import { useActionState, useEffect, useState } from "react";
import Form from "next/form"
import { CidadeDetails } from "@/types/cidade";
import { Ponto } from "@/types/ponto";
import { createBusLineAction, CreateBusLineState } from "../actions/busLineActions";
import { BusRoute } from "@/types/busRoute";
import { BusLineBasic } from "@/types/busLine";
import GoBackButton from "@/app/components/goBackButton";
import BusRouteManager from "./busRouteManager";

const initialState: CreateBusLineState = {
  success: false,
};

export default function BusLineManager({
  city,
  line,
  busStops,
  onBackClick
}: {
  city: CidadeDetails | null,
  line: BusLineBasic | null,
  busStops: Ponto[],
  onBackClick: () => void
}) {
  const [state, createBusLine, isPending] = useActionState(createBusLineAction, initialState);
  const [busLine, setBusLine] = useState<BusLineBasic>({
    id: line?.id ?? -1,
    codigo: line?.codigo ?? "",
    origem: line?.origem ?? "",
    destino: line?.destino ?? "",
    cidade_id: line?.cidade_id ?? city?.id ?? -1
  });
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [route, setRoute] = useState<BusRoute | null>(null);
  const [selected, setSelected] = useState<Ponto[]>([]);
  const [details, setDetails] = useState(false);
  const [newRoute, setNewRoute] = useState<BusRoute | null>(null);
  const labelStyle = "font-semibold mr-3";
  const inputStyle = "bg-space-indigo-700 outline-0 text-white text-sm py-1 px-3 rounded-md";
  const buttonStyle = "px-5 py-1 bg-icy-aqua-400 rounded-md text-space-indigo-700 font-semibold cursor-pointer";

  if(!city) return <></>

  useEffect(() => {
    if (state.success && state.data) {
      setBusLine(state.data)
    }
}, [state]);


  function getPoints(route: BusRoute | null) {
    if(!route) return [];
    const points: Ponto[] = route.pontos.map((point) => ({
      id: point.id,
      logradouro: point.logradouro ?? "",
      numero: point.numero ?? "",
      cidade_id: point.cidade_id ?? line?.cidade_id ?? -1,
      coordenada: point.coordenada
    }))

    return points;
  }


  return (
    <div className="w-6xl">
      <GoBackButton onClick={onBackClick} style="size-[30px] text-icy-aqua-500">
        <span className="font-semibold font-display">Voltar</span>
      </GoBackButton>
      <Form action={createBusLine}>
        <div className="flex gap-3 w-full py-3">
          <input type="hidden" name="city" value={busLine.cidade_id}/>
          <input type="hidden" name="id" value={busLine.id} />
          <div>
            <label htmlFor="code" className={labelStyle}>Código</label>
            <input type="text" name="code" id="code" value={busLine.codigo}
             onChange={(e) => setBusLine((prev) => ({...prev, codigo: e.target.value}))} 
             className={inputStyle}
            />
          </div>
          <div className="flex-1 flex">
            <label htmlFor="origem" className={labelStyle}>Origem</label>
            <input type="text" name="origin" id="origin" value={busLine.origem} 
              onChange={(e)=> setBusLine(prev => ({...prev, origem: e.target.value}))} 
              className={inputStyle + " flex-1"}
            />
          </div> 
          <div className="flex-1 flex">
            <label htmlFor="destino" className={labelStyle}>Destino</label>
            <input type="text" name="destination" id="destination" value={busLine.destino} 
              onChange={(e)=> setBusLine(prev => ({...prev, destino: e.target.value}))} 
              className={inputStyle + " flex-1"}
            />
          </div>
        </div>
        <button type="submit" className={buttonStyle}>Salvar</button>
      </Form>
      <BusRouteManager
        bounds={city.enquadramento}
        busLine={busLine.id}
        city={busLine.cidade_id}
        busStops={busStops}
      />
    </div>
  )
}