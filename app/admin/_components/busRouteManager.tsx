import { useEffect, useState } from "react";
import BusRouteDetails from "./busRouteDetails";
import { Ponto } from "@/types/ponto";
import { BusRoute } from "@/types/busRoute";
import { FaPlus } from "react-icons/fa";
import BusRouteList from "./busRouteList";
import { activateRouteAction, createRouteAction, deleteRouteAction, editRouteAction, getBusRoutesAction } from "../actions/busRouteActions";
import dynamic from "next/dynamic";
const RouteManagementMap = dynamic(
  () => import("@/app/components/routeManagementMap"),
  {
    ssr: false,
  }
);

export default function BusRouteManager({
  bounds,
  busStops,
  busLine,
  origin,
  destination,
  city,
}: {
  bounds: [[number,number], [number,number]],
  busStops: Ponto[],
  busLine: number,
  origin: string,
  destination: string,
  city: number,
}) {
  const [allRoutes, setAllRoutes] = useState<BusRoute[]>([]);
  const [route, setRoute] = useState<BusRoute | null>(null);
  const [newRoute, setNewRoute] = useState<BusRoute | null>(null);
  const [details, setDetails] = useState(false);
  const [isOutbound, setIsOutbound] = useState(true);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const setEditRoute = (newRoute) ? setNewRoute : setRoute;
  const directionButtonStyle = "font-display flex-1 text-icy-aqua-100 uppercase border-b-3 py-2 cursor-pointer";

  const bs = newRoute ?? route;
  const orderedBusStops: Ponto[] = !bs?.pontos
  ? []
  : bs.pontos
      .map(routePoint =>
        busStops.find(busStop => busStop.id === routePoint.id)
      )
      .filter((busStop): busStop is Ponto => busStop !== undefined);

  useEffect(() => {
    if(busLine < 0) return;
    const loadData = async () => {
      const res = await getBusRoutesAction(busLine);
      if(res.success) {
        const data = res.data ?? [];
        setAllRoutes(data);
        setRoute(data[0]);
      }
    };

    loadData();
  }, [busLine]);

  useEffect(() => {
    let stops:BusRoute | null = (newRoute) ? newRoute : route;
    if(!stops) {
      setSelected(new Set());
      return;
    }
    setSelected(() => {
      return new Set(stops.pontos
                        .filter((busStop) => busStop.id !== undefined)
                        .map(busStop => busStop.id!)
                      );
    });
  }, [route, newRoute]);

  function getPoints(route: BusRoute | null) {
    if(!route) return [];
    const points: Ponto[] = route.pontos.map((point) => ({
      id: point.id,
      logradouro: point.logradouro ?? "",
      numero: point.numero ?? "",
      cidade_id: city,
      coordenada: point.coordenada
    }))

    return points;
  }

  function addRoutePoint(point: Ponto) {
    setEditRoute((route) => {
      if(!route) return route;
      return ({
        ...route,
        pontos: [
          ...route.pontos,
          point
        ]
      })
    });
  }

  function removeRouteBusStop(point: Ponto) {
    setEditRoute((route) => {
      if(!route) return route;
      return ({
        ...route,
        pontos: route.pontos.filter(p => p.id !== point.id)
      })
    });
  }

  function removeRouteAuxPoint(idx: number) {
    setEditRoute((route) => {
      if(!route) return route;
      return {
        ...route,
        pontos: [
          ...route.pontos.slice(0, idx),
          ...route.pontos.slice(idx+1)
        ]
      }
    });
  }

  async function createRoute() {
    if(busLine < 0 || !newRoute) return;
    const res = await createRouteAction({
      active: false,
      line: busLine,
      isOutbound: isOutbound,
      busStops: getPoints(newRoute)
    });

    if(res.success) {
      if(res.data) {
        setAllRoutes(routes => [
          ...routes,
          res.data
        ]);
        setNewRoute(null);
        setDetails(false);
      }
    } else {
      console.log(res);
    }
  }

  async function editRoute() {
    if(!route) return;
    const res = await editRouteAction(route);
    if(res.success) {
      if(res.data) {
        setAllRoutes(routes => routes.map(route => route.id === res.data.id ? res.data : route));
        setDetails(false);
      }
    }
  }

  async function deleteRoute(busRoute: BusRoute) {
    const res = await deleteRouteAction(busRoute.id);
    if(res?.success) {
      setAllRoutes((routes) => routes.filter(r => r.id != busRoute.id))
      if(route && route.id === busRoute.id) {
        setRoute(allRoutes[0] ?? null);
      }
    }
  }

  async function editGeometry(idx: number, coordinates: [number, number]) {
    setEditRoute((route) => {
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
    })
  }

  function newPoint(latitude: number, longitude: number) {
    const point: Ponto = {
      logradouro: "",
      numero: "",
      coordenada: [latitude, longitude],
      cidade_id: city
    };

    return point;
  }

  return(
    <div className="w-full flex h-130 border-2 border-icy-aqua-700 relative mt-5">
      <h2 className="bg-icy-aqua-700 font-title text-semibold text-white tracking-widest rounded-t-md font-bold absolute top-[-25px] left-0 italic px-2">Trajetos</h2>
      <RouteManagementMap
        bounds={bounds}
        points={busStops}
        route={newRoute ?? route}
        editMode={details}
        addAuxPoint={(latitude, longitude) => {
          addRoutePoint(newPoint(latitude, longitude));
        }}
        removeAuxPoint={removeRouteAuxPoint}
        onSelectPoint={(busStop: Ponto) => {
          if(!busStop.id) return;
          addRoutePoint(busStop);
        }}
        onUnselectPoint={(busStop: Ponto) => {
          if(!busStop.id) return;
          removeRouteBusStop(busStop);
        }}
        onEditGeometry={editGeometry}
        isPointSelected={(point: Ponto) => {
          if(!point.id) return false;
          return selected.has(point.id);
        }}
        />
        <div className="w-2xl h-full bg-space-indigo-700 relative overflow-y-auto">
          {details && 
            <div className="flex flex-col justify-between h-full">
              <div className="">
                <BusRouteDetails 
                  busStops={orderedBusStops}
                  onBackClick={() => {
                    if(newRoute) {
                      setNewRoute(null)
                    };
                    setDetails(false);
                    }
                  }
                  onActivateRoute={() => {
                    if(!route) return;
                    activateRouteAction(route);
                  }}

                />
              </div>
              <button type="button"
                onClick={() => {
                  (newRoute) ? createRoute() : editRoute();
                }}
                //disabled={(route) ? selected.length < 2 : true}
                className="bg-icy-aqua-700 text-icy-aqua-400">
                Salvar
              </button>
            </div>
          }
          {!details &&
            <div>
              <div className="flex justify-around bg-icy-aqua-600">
                <button type="button" 
                  className={`${directionButtonStyle} ${isOutbound ? "border-icy-aqua-100 font-semibold" : "border-transparent"}`}
                  onClick={() => setIsOutbound(true)}
                >
                  {origin}
                </button>
                <button type="button" 
                  className={`${directionButtonStyle} ${!isOutbound ? "border-icy-aqua-100 font-semibold" : "border-transparent"}`}
                  onClick={() => setIsOutbound(false)}  
                >
                  {destination}
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-full flex justify-center my-3">
                  <button type="button"
                    className="py-2 w-9/10 bg-icy-aqua-700 group text-icy-aqua-50 font-bold flex justify-center items-center gap-2 cursor-pointer"
                    onClick={() => {
                        setNewRoute({
                          id: -1,
                          ativo: false,
                          linha: busLine,
                          ida: isOutbound,
                          pontos: [],
                          vigencia: null,
                          updated_at: new Date()
                        });
                        setDetails(true);
                      }
                    }
                  >
                    <FaPlus className="text-white transition-all group-hover:rotate-180"/>
                    Criar trajeto
                  </button>
                </div>
                <BusRouteList 
                  routes={allRoutes.filter(route => route.ida === isOutbound)}
                  current={(route) ? route.id : -1}
                  onSelectRoute={(route: BusRoute) => setRoute(route)} 
                  onDeleteRoute={(route: BusRoute) => deleteRoute(route)}
                  onDetails={() => setDetails(true)}
                />
              </div>
            </div>
          }
        </div>
    </div>
  );
}