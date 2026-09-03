'use client'

import L from "leaflet"
import { 
  CircleMarker,
  MapContainer, 
  Marker,
  useMap,
  useMapEvents, 
  TileLayer 
} from "react-leaflet"
import { useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { FaBus } from "react-icons/fa";
import PontosOnMap from "./pontosMap";
import { Ponto } from "@/types/ponto";

export default function CidadeMap({
  bounds,
  pontos,
  adicionarPontos,
  pontoHover,
  onMapClick,
  onSelectPoint,
  isPointSelected
}: {
  bounds: [[number,number], [number,number]],
  pontos: Ponto[],
  adicionarPontos: boolean,
  pontoHover: Ponto | null,
  onMapClick: (latitude:number, longitude:number) => void,
  onSelectPoint: (ponto: Ponto) => void,
  isPointSelected: (ponto: Ponto) => boolean
}) {
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        if(!adicionarPontos) return;
        onMapClick(e.latlng.lat, e.latlng.lng);
      },
    });

    return null;
  }

  function CentralizarPonto({ ponto }: { ponto: Ponto | null }) {
    const map = useMap();

    useEffect(() => {
      if (!ponto) return;

      map.setView(
        [ponto.coordenada[0], ponto.coordenada[1]],
        map.getZoom()
      );
    }, [ponto, map]);

    return null;
  }

  return (
    <>
      <MapContainer 
        bounds={bounds}
        className="h-[500px] w-full"
        >
          <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler />
          <PontosOnMap pontos={pontos} onSelectPoint={onSelectPoint} selecionado={isPointSelected}/>
          <CentralizarPonto ponto={pontoHover} />
      </MapContainer>
    </>
  )
}