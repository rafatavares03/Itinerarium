"use client";

import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { FaBus } from "react-icons/fa";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { useState } from "react";

type Props = {
  pontos: [number, number][];
};

export default function PontosOnMap({ pontos }: { pontos: [number, number][] }) {
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

  const busIcon = L.divIcon({
    html: renderToStaticMarkup(
      <div
        style={{
          width: `${tamanho}px`,
          height: `${tamanho}px`,
          borderRadius: "50% 50% 50% 0",
          transform: "rotate(-45deg)",
          backgroundColor: "#00ffff",
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
          position={ponto}
          icon={busIcon}
        />
      ))}
    </>
  );
}