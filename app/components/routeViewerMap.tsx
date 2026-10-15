'use client'

import { 
  MapContainer, 
  Polyline,
  TileLayer 
} from "react-leaflet"
import PontosOnMap from "./pontosOnMap";
import { Ponto } from "@/types/ponto";
import { BusRoute } from "@/types/busRoute";

export default function RouteViewerMap({
  bounds,
  points,
  route,
}: {
  bounds: [[number, number], [number, number]],
  points: Ponto[],
  route: BusRoute | null,
}) {
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
          selecionado={() => true}
          destacado={() => false}
        />
        
        {route && route.pontos && (
          <Polyline positions={route.pontos.map((point) => point.coordenada)} />
        )}
      </MapContainer>
    </div>
  )
}