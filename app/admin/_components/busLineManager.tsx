"use client"

import { useActionState, useEffect, useState } from "react";
import Form from "next/form"
import { CidadeDetails } from "@/types/cidade";
import { Ponto } from "@/types/ponto";
import { createBusLineAction, CreateBusLineState } from "../actions/busLineActions";
import dynamic from "next/dynamic";
import { createRouteAction, getBusRoutesAction } from "../actions/busRouteActions";
import { BusRoute } from "@/types/busRoute";
import { LinhaBasic } from "@/types/linha";
const CidadeMap = dynamic(
  () => import("@/app/components/cidadeMap"),
  {
    ssr: false,
  }
);

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
  line: LinhaBasic | null,
  busStops: Ponto[],
  onBackClick: () => void
}) {
  const [state, createBusLine, isPending] = useActionState(createBusLineAction, initialState);
  const [codigo, setCodigo] = useState(line?.codigo ?? "");
  const [nome, setNome] = useState(line?.nome ?? "");
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [route, setRoute] = useState<Ponto[]>([]);
  const [selected, setSelected] = useState<Ponto[]>([]);
  const labelStyle = "font-semibold mr-3";
  const inputStyle = "bg-space-indigo-700 outline-0 text-white text-sm py-1 px-3 rounded-md";
  const buttonStyle = "px-5 py-1 bg-icy-aqua-400 rounded-md text-space-indigo-700 font-semibold cursor-pointer";

  if(!city) return <></>

  useEffect(() => {
    if(!line) return;
    const loadData = async () => {
      const res = await getBusRoutesAction(line.id);
      if(res.success) {
        console.log(res);
        const data = res.data ?? [];
        setRoutes(data);

        const novaRoute = data[0]?.geometria.coordinates.map(
          ([longitude, latitude]) => newPoint(longitude, latitude)
        ) ?? [];
      
        setRoute(novaRoute);
        setSelected(data[0]?.pontos.map(point => ({
          id: point.id,
          logradouro: point.logradouro,
          numero: point.numero,
          coordenada: point.coordenada,
          cidade_id: point.cidade_id
        })) ?? []);

        console.log(route);
      }
      console.log(routes);
    };

    loadData();
  }, [])

  function addRoutePoint(point: Ponto) {
    setRoute((points) => [
      ...points,
      point
    ]);
  }

  function newPoint(latitude: number, longitude: number) {
    const point: Ponto = {
      logradouro: "",
      numero: "",
      coordenada: [latitude, longitude],
      cidade_id: city!.id
    };

    return point;
  }


  return (
    <div className="w-6xl">
      <button type="button" onClick={onBackClick}>Voltar</button>
      <Form action={createBusLine}>
        <div className="flex gap-3 w-full py-3">
          <input type="hidden" name="city" value={city.id}/>
          <div>
            <label htmlFor="code" className={labelStyle}>Código</label>
            <input type="text" name="code" id="code" value={codigo} onChange={(e) => setCodigo(e.target.value)} className={inputStyle}/>
          </div>
          <div className="flex-1 flex">
            <label htmlFor="name" className={labelStyle}>Nome</label>
            <input type="text" name="name" id="name" value={nome} onChange={(e)=> setNome(nome)} className={inputStyle + " flex-1"}/>
          </div>
        </div>
        { line &&

          <div className="w-full flex h-130">
          <CidadeMap 
            bounds={city.enquadramento}
            pontos={busStops}
            rota={route}
            adicionarPontos={true}
            pontoDestaque={null}
            onMapClick={(latitude: number, longitude: number) => {
              addRoutePoint(newPoint(latitude, longitude));
            }}
            onSelectPoint={(point: Ponto) => {
              setSelected((points) => [
                ...points,
                point
              ]);
              addRoutePoint(point);
            }}
            onDeleteNew={() => console.log("delete new")}
            isPointSelected={(point: Ponto) => selected.some(p => p.id === point.id)}
            isPointHighlighted={() => false}
            />
            <div className="w-[350px] h-full bg-white p-5 relative overflow-y-auto">
              {selected.map((select, idx) =>
                <div key={select.id}><em>{idx+1}</em> - {select.logradouro}, {select.numero}</div>
              )}
              <button type="button"
                onClick={() => createRouteAction({
                  active: true,
                  line: line.id,
                  busStops: selected
                })}
                disabled={selected.length < 2}
                className="absolute bg-icy-aqua-700 bottom-0 left-0 right-0 text-icy-aqua-400">
                Salvar
              </button>
            </div>
          </div>
        }
        <button type="submit" className={buttonStyle}>Salvar</button>
      </Form>
    </div>
  )
}