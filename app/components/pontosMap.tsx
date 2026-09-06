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
  novos,
  selecionado,
  onSelectPoint,
 }: { 
  pontos: Ponto[],
  novos?: Ponto[],
  selecionado: (ponto: Ponto) => boolean,
  onSelectPoint: (ponto: Ponto) => void,
}) {
  const [zoom, setZoom] = useState(13);
  console.log(novos);
  useMapEvents({
    zoomend(e) {
      setZoom(e.target.getZoom());
    },
  });

  if (zoom < 15) {
    return null;
  }

  const tamanho =
    zoom >= 17 ? 30 :
    zoom >= 15 ? 24 :
    18;

  const busIcon = (ponto: Ponto, corNormal:string = "#00ffff", corSelect:string = "#f00") => L.divIcon({
    html: renderToStaticMarkup(
      <div
        style={{
          width: `${tamanho}px`,
          height: `${tamanho}px`,
          borderRadius: "50% 50% 50% 0",
          transform: "rotate(-45deg)",
          backgroundColor: selecionado(ponto) ? corSelect : corNormal,
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
    iconAnchor: [tamanho / 2, tamanho],
  });

  return (
    <>
      {pontos.map((ponto, index) => (
        <Marker
          key={ponto.id ?? index}
          position={ponto.coordenada}
          icon={busIcon(ponto)}
          eventHandlers={{
            click: () => onSelectPoint(ponto),
          }}
        />
      ))}
      {novos?.map((ponto) => (
        <Marker
          key={ponto.coordenada.toString()}
          position={ponto.coordenada}
          icon={busIcon(ponto, "#9ae600", "#ab0303")}
          eventHandlers={{
            click: () => onSelectPoint(ponto),
          }}
        />
      ))}
    </>
  );
}