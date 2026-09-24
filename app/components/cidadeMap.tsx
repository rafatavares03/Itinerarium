'use client'

import { 
  MapContainer, 
  useMap,
  useMapEvents, 
  TileLayer 
} from "react-leaflet"
import { useEffect } from "react";
import PontosOnMap from "./pontosOnMap";
import { Ponto } from "@/types/ponto";

export default function CidadeMap({
  bounds,
  pontos,
  novos,
  adicionarPontos,
  pontoDestaque,
  onMapClick,
  onSelectPoint,
  onDeleteNew,
  isPointSelected,
  isPointHighlighted
}: {
  bounds: [[number,number], [number,number]],
  pontos: Ponto[],
  novos?: Ponto[],
  adicionarPontos: boolean,
  pontoDestaque: Ponto | null,
  onMapClick: (latitude:number, longitude:number) => void,
  onSelectPoint: (ponto: Ponto) => void,
  onDeleteNew: (ponto: Ponto) => void,
  isPointSelected: (ponto: Ponto) => boolean
  isPointHighlighted: (ponto: Ponto) => boolean
}) {
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        console.log("Centralizando:", pontoDestaque);
        if(!adicionarPontos) return;
        onMapClick(e.latlng.lat, e.latlng.lng);
      },
      contextmenu(e) {
        e.originalEvent.preventDefault();
      }
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
        className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler />
          <PontosOnMap 
            pontos={pontos}
            novos={novos}
            onClick={onSelectPoint}
            onContextMenu={onDeleteNew}
            selecionado={isPointSelected}
            destacado={isPointHighlighted}
          />
          <CentralizarPonto ponto={pontoDestaque} />
      </MapContainer>
    </>
  )
}