'use client'

import { use, useEffect, useState } from 'react';
import { getCityBoundsAction } from '@/app/actions/cityActions';
import { getBusRoutesAction } from '@/app/actions/busRouteActions';
import { BusRoute } from '@/types/busRoute';
import { Ponto } from '@/types/ponto';
import dynamic from 'next/dynamic';
import { BusLineBasic } from '@/types/busLine';
import { getLineAction } from '@/app/actions/busLineActions';
import { FaEye } from 'react-icons/fa';

const RouteViewerMap = dynamic(
  () => import("@/app/components/routeViewerMap"),
  {
    ssr: false,
  }
);

export default function Line({
  params
}: {
  params: Promise<{city: string, line: string}>
}) {
  const { city, line } = use(params);
  const [lineInfo, setLineInfo] = useState<BusLineBasic | null>(null);
  const [bounds, setBounds] = useState<[[number, number], [number, number]] | null>(null);
  const [busRoutes, setBusRoutes] = useState<BusRoute[]>([]);
  const [route, setRoute] = useState<BusRoute | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const [lineData, cityBounds, routeData] = await Promise.all(
        [getLineAction(parseInt(line)), getCityBoundsAction(parseInt(city)), getBusRoutesAction(parseInt(line))]
      );
      if(lineData.success) {
        setLineInfo(lineData.data ?? null);
      }
      if(cityBounds.success) {
        setBounds(cityBounds.data ?? null);
      }
      if(routeData?.success) {
        setBusRoutes(routeData.data ?? []);
        if(routeData.data) {
          setRoute(routeData.data[0] ?? null);
        }
      }
    }

    loadData();
  }, [city, line]);

  const [currentTime, setCurrentTime] = useState(new Date());

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentTime(new Date());
  }, 60_000);

  return () => clearInterval(interval);
}, []);

function formatRemainingTime(expiration: Date | string) {
  const expirationDate = new Date(expiration);
  const difference = expirationDate.getTime() - currentTime.getTime();

  if(difference <= 0) {
    return "expired";
  }

  const totalMinutes = Math.floor(difference / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if(days > 0) {
    return `${days}d ${hours}h`;
  }

  if(hours > 0) {
    return `${hours}h ${minutes}min`;
  }

  return `${minutes}min`;
}

  function getPoints(route: BusRoute | null) {
    if(!route) return [];
    const points: Ponto[] = route.pontos
                                    .filter((point) => point.id !== undefined)
                                    .map((point) => {
      return {
      id: point.id,
      logradouro: point.logradouro ?? "",
      numero: point.numero ?? "",
      cidade_id: parseInt(city),
      coordenada: point.coordenada
    }})

    return points;
  }
  const routeActiveStyle = " bg-red-500";
  const buttonStyle = "cursor-pointer transition-all "
  const spanStyle = "bg-icy-aqua-100 text-space-indigo-700 text-xs font-display font-semibold px-2 rounded-md uppercase"
  
  return (
    <div className="flex w-7xl h-80 bg-space-indigo-700">
      {bounds &&
        <>
        <RouteViewerMap bounds={bounds} points={getPoints(route)} route={route}/>
         <div className="flex flex-col gap-2 h-full w-[350px]">
              {busRoutes && busRoutes.map((busRoute, idx) => 
                <div key={busRoute.id} className="relative">
                  <button type="button" onClick={() => setRoute(busRoute)}
                    className={"bg-icy-aqua-300 flex justify-between items-center w-4/5 px-3 rounded-e-lg transition-all text-start hover:w-5/6" 
                                + ((route && busRoute.id === route.id) ? routeActiveStyle : " ")
                    }>
                      <p>{busRoute.ida ? lineInfo?.destino : lineInfo?.origem}</p>
      
                      {busRoute.vigencia && new Date(busRoute.vigencia) > currentTime
                        ? <span className={spanStyle}>{formatRemainingTime(busRoute.vigencia)}</span>: ""}
                  </button>
                  <div className="absolute top-0 bottom-0 flex items-center right-0 gap-1 px-2">
                    <button type="button"
                      className={buttonStyle + ((route && busRoute.id !== route.id) ? "opacity-0 duration-0" : "opacity-100 duration-[3s]")}
                      /*onClick={onDetails}*/
                      >
                      <FaEye className="text-icy-aqua-100 size-[20px]"/>
                    </button>
                  </div>
                </div>
              )}
            </div>
        </>
      }

    </div>
  )
}