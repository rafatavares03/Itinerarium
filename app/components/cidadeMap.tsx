'use client'

import L from "leaflet"
import { 
  CircleMarker,
  MapContainer, 
  Marker,
  useMapEvents, 
  TileLayer 
} from "react-leaflet"
import { renderToStaticMarkup } from "react-dom/server";
import { FaBus } from "react-icons/fa";
import PontosOnMap from "./pontosMap";

export default function CidadeMap({
  center,
  pontos,
  adicionarPontos,
  onMapClick
}: {
  center: [number, number],
  pontos: [number, number][],
  adicionarPontos: boolean,
  onMapClick: (latitude:number, longitude:number) => void
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

  return (
    <>
      <MapContainer 
        center={center}
        className="h-[500px] w-full"
        zoom={20}
        >
          <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler />
          <PontosOnMap pontos={pontos} />
      </MapContainer>
    </>
  )
}