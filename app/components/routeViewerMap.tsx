'use client'

import { 
  MapContainer, 
  Polyline,
  TileLayer 
} from "react-leaflet"
import PontosOnMap from "./pontosOnMap";
import { Ponto } from "@/types/ponto";
import { BusRoute } from "@/types/busRoute";
import { FaBus } from "react-icons/fa";

export default function RouteViewerMap({
  bounds,
  points,
  route,
}: {
  bounds: [[number, number], [number, number]],
  points: Ponto[],
  route: BusRoute | null,
}) {
  const renderMapPinIcon = (color: string) => (
    <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
      <div
        className="w-5 h-5 rounded-tl-full rounded-tr-full rounded-bl-full bg-white shadow-md flex items-center justify-center border border-white"
        style={{
          backgroundColor: color,
          transform: "rotate(45deg)",
        }}
      >
        <div style={{ transform: "rotate(-45deg)" }} className="flex items-center justify-center">
          <FaBus size={10} color="#222" />
        </div>
      </div>
    </div>
  );

  const activePoints = (route && route.pontos && route.pontos.length > 0) 
    ? route.pontos 
    : points;

  const primeiroPonto = activePoints[0];
  const ultimoPonto = activePoints[activePoints.length - 1];
  return (
    <div className="w-full h-full relative">
      <MapContainer 
        bounds={bounds}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <PontosOnMap 
          pontos={points}
          onClick={() => {}}
          onContextMenu={() => {}}
          selecionado={() => false}
          gradiente={true}
          destacado={() => false}
        />
        
        {route && route.pontos && (
          <Polyline positions={route.pontos.map((point) => point.coordenada)} />
        )}
      </MapContainer>
      {activePoints.length > 0 && (
        <div className="absolute top-1 right-1 z-[1000] bg-space-indigo-700 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200 text-icy-aqua-100 text-sm max-w-xs">
          <h4 className="font-semibold mb-2">Legenda</h4>
          
          <div className="space-y-3">
            {primeiroPonto && (
              <div className="flex items-center gap-3">
                {renderMapPinIcon("#fff")} 
                <div>
                  <span className=" text-xs truncate block max-w-[180px]">
                    {'Primeiro Ponto'}
                  </span>
                </div>
              </div>
            )}

            {ultimoPonto && activePoints.length > 1 && (
              <div className="flex items-center gap-3">
                {renderMapPinIcon("#f00")} 
                <div>
                  <span className=" text-xs truncate block max-w-[180px]">
                    {'Último Ponto'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}