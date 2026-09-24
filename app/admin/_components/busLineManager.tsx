"use client"

import { useActionState, useEffect, useState } from "react";
import Form from "next/form"
import { CidadeDetails } from "@/types/cidade";
import { Ponto } from "@/types/ponto";
import { createBusLineAction, CreateBusLineState } from "../actions/busLineActions";
import dynamic from "next/dynamic";
import { createRouteAction, deleteRouteAction, getBusRoutesAction } from "../actions/busRouteActions";
import { BusRoute } from "@/types/busRoute";
import { LinhaBasic } from "@/types/linha";
import { FaPlus } from "react-icons/fa";
import BusRouteList from "./busRouteList";
import GoBackButton from "@/app/components/goBackButton";
import BusRouteDetails from "./busRouteDetails";
const RouteManagementMap = dynamic(
  () => import("@/app/components/routeManagementMap"),
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
  const [route, setRoute] = useState<BusRoute | null>(null);
  const [selected, setSelected] = useState<Ponto[]>([]);
  const [details, setDetails] = useState(false);
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

        const novaRoute = getPoints(data[0]?? []);
      
        setRoute(data[0]);
        setSelected(novaRoute.filter(point => point.id));

        console.log(route);
      }
      console.log(routes);
    };

    loadData();
  }, [])

  function getPoints(route: BusRoute) {
    const points: Ponto[] = route.pontos.map((point) => ({
      id: point.id,
      logradouro: point.logradouro ?? "",
      numero: point.numero ?? "",
      cidade_id: point.cidade_id ?? line?.cidade_id ?? -1,
      coordenada: point.coordenada
    }))

    return points;
  }

  function addRoutePoint(point: Ponto) {
    setRoute((route) => {
      if(!route) return route;
      return ({
        ...route,
        pontos: [
          ...route.pontos,
          point
        ]
      })
    })
  }

  function removeRoutePoint(point: Ponto) {
    setRoute((route) => {
      if(!route) return route;
      return ({
        ...route,
        pontos: route.pontos.filter(p => p.id !== point.id)
      })
    })
  }

  function selectRoute(route: BusRoute) {
    const points = getPoints(route);
    setRoute(route);
    setSelected(points);
  }

  async function createRoute() {
    if(!line || !route) return;
    const res = await createRouteAction({
      active: false,
      line: line.id,
      busStops: getPoints(route)
    });

    if(res.success) {
      if(res.data) {
        setRoutes(routes => [
          ...routes,
          res.data
        ]);
      }
    }
  }

  async function deleteRoute(route: BusRoute) {
    const res = await deleteRouteAction(route.id);
    if(res?.success) {
      setRoutes((routes) => routes.filter(r => r.id != route.id))
    }
  }

  async function editGeometry(idx: number, coordinates: [number, number]) {
    setRoute((route) => {
      if(!route) return route;
      return ({
        ...route,
        pontos: route.pontos.map((point, index) => {
          if(index === idx) {
            return {
              ...point,
              coordenada: coordinates
            }
          }
          return point;
        })
      })
    });
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
      <GoBackButton onClick={onBackClick} style="size-[30px] text-icy-aqua-500">
        <span className="font-semibold font-display">Voltar</span>
      </GoBackButton>
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
        <button type="submit" className={buttonStyle}>Salvar</button>
      </Form>
        { line &&

          <div className="w-full flex h-130 border-2 border-icy-aqua-700 relative mt-5">
            <h2 className="bg-icy-aqua-700 font-title text-semibold text-white tracking-widest rounded-t-md font-bold absolute top-[-25px] left-0 italic px-2">Trajetos</h2>
            <RouteManagementMap
              bounds={city.enquadramento}
              points={busStops}
              route={route}
              editMode={details}
              addAuxPoint={(latitude: number, longitude: number) => {
                addRoutePoint(newPoint(latitude, longitude));
              }}
              removeAuxPoint={(idx: number) => {
                setRoute((route) => {
                  if(!route) return route;
                  return {
                    ...route,
                    pontos: [
                      ...route.pontos.slice(0, idx),
                      ...route.pontos.slice(idx+1)
                    ]
                  }
                })
              }}
              onSelectPoint={(point: Ponto) => {
                setSelected((points) => [
                  ...points,
                  point
                ]);
                addRoutePoint(point);
              }}
              onUnselectPoint={(point: Ponto) => {
                setSelected(points => points.filter(p => p.id !== point.id));
                removeRoutePoint(point);
              }}
              onEditGeometry={(idx: number, coordinates: [number, number]) => editGeometry(idx, coordinates)}
              isPointSelected={(point: Ponto) => selected.some(p => p.id === point.id)}
              />
              <div className="w-2xl h-full bg-space-indigo-700 relative overflow-y-auto">
                {details && 
                  <>
                    <BusRouteDetails busStops={selected} onBackClick={() => setDetails(false)}/>
                    <button type="button"
                      onClick={createRoute}
                      disabled={(route) ? route.pontos.length < 2 : true}
                      className="absolute bg-icy-aqua-700 bottom-0 left-0 right-0 text-icy-aqua-400">
                      Salvar
                    </button>
                  </>
                }
                {!details &&
                  <div className="flex flex-col gap-2">
                    <div className="w-full flex justify-center my-3">
                      <button type="button"
                        className="py-2 w-9/10 bg-icy-aqua-700 group text-icy-aqua-50 font-bold flex justify-center items-center gap-2 cursor-pointer"
                      >
                        <FaPlus className="text-white transition-all group-hover:rotate-180"/>
                        Criar rota
                      </button>
                    </div>
                    <BusRouteList 
                    routes={routes}
                    current={(route) ? route.id : -1}
                    onSelectRoute={(route) => selectRoute(route)} 
                    onDeleteRoute={(route) => deleteRoute(route)}
                    onDetails={() => setDetails(true)}
                    />
                  </div>
                }
              </div>
          </div>
        }
    </div>
  )
}