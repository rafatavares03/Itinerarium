'use client'

import { use, useEffect, useState } from 'react';
import { getCityBoundsAction } from '@/app/actions/cityActions';
import { getBusRoutesAction } from '@/app/actions/busRouteActions';
import { BusRoute } from '@/types/busRoute';
import { Ponto } from '@/types/ponto';
import dynamic from 'next/dynamic';

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
  const [bounds, setBounds] = useState<[[number, number], [number, number]] | null>(null);
  const [busRoutes, setBusRoutes] = useState<BusRoute[]>([]);
  const [route, setRoute] = useState<BusRoute | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const [cityBounds, lineData] = await Promise.all(
        [getCityBoundsAction(parseInt(city)), getBusRoutesAction(parseInt(line))]
      );
      console.log(cityBounds);
      if(cityBounds.success) {
        setBounds(cityBounds.data ?? null);
      }
      if(lineData?.success) {
        console.log(lineData.data);
        setBusRoutes(lineData.data ?? []);
        if(lineData.data) {
          setRoute(lineData.data[0] ?? null);
        }
      }
      console.log(lineData);
    }

    loadData();
  }, [city, line]);

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
  
  return (
    <div className="flex w-7xl h-80 bg-red-500">
      {bounds &&
        <RouteViewerMap bounds={bounds} points={getPoints(route)} route={route}/>
      }

    </div>
  )
}