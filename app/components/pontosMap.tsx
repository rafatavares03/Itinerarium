"use client";

import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { FaBus } from "react-icons/fa";
import {
  Marker,
  useMapEvents,
} from "react-leaflet";
import { useState } from "react";
import { Ponto } from "@/types/ponto";

export default function PontosOnMap({ 
  pontos,
  selecionado,
  onSelectPoint,
 }: { 
  pontos: Ponto[],
  selecionado: (ponto: Ponto) => boolean,
  onSelectPoint: (ponto: Ponto) => void,
}) {
  const [zoom, setZoom] = useState(13);

  useMapEvents({
    zoomend(e) {
      setZoom(e.target.getZoom());
    },
  });

  if (zoom < 12) {
    return null;
  }

  const tamanho =
    zoom >= 17 ? 30 :
    zoom >= 15 ? 24 :
    18;

  const busIcon = (ponto: Ponto) => L.divIcon({
    html: renderToStaticMarkup(
      <div
        style={{
          width: `${tamanho}px`,
          height: `${tamanho}px`,
          borderRadius: "50% 50% 50% 0",
          transform: "rotate(-45deg)",
          backgroundColor: selecionado(ponto) ? "#f00" : "#00ffff",
          border: "2px solid white",
          boxShadow: "0 2px 5px rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >

        <div style={{ transform: "rotate(45deg)" }}>
          <FaBus size={tamanho * 0.5} color="#222" />
        </div>
      </div>
    ),
    className: "",
    iconSize: [tamanho, tamanho],
    iconAnchor: [tamanho / 2, tamanho / 2],
  });

  return (
    <>
      {pontos.map((ponto, index) => (
        <Marker
          key={index}
          position={ponto.coordenada}
          icon={busIcon(ponto)}
          eventHandlers={{
            click: () => onSelectPoint(ponto),
          }}
        />
      ))}
    </>
  );
}