'use client'

import L from "leaflet"
import { 
  MapContainer, 
  useMap,
  useMapEvents, 
  Polyline,
  Marker,
  TileLayer 
} from "react-leaflet"
import { useEffect, useState } from "react";
import PontosOnMap from "./pontosOnMap";
import { Ponto } from "@/types/ponto";
import { CiCirclePlus } from "react-icons/ci";
import { BusRoute } from "@/types/busRoute";

export default function RouteManagementMap({
  bounds,
  points,
  route,
  addAuxPoint,
  editMode,
  removeAuxPoint,
  onSelectPoint,
  onUnselectPoint,
  onEditGeometry,
  isPointSelected,
}: {
  bounds: [[number,number], [number,number]],
  points: Ponto[],
  route: BusRoute | null,
  editMode: boolean
  addAuxPoint: (latitude:number, longitude:number) => void,
  removeAuxPoint: (idx: number) => void,
  onSelectPoint: (point: Ponto) => void,
  onUnselectPoint: (point: Ponto) => void,
  onEditGeometry: (idx: number, coordinates: [number, number]) => void
  isPointSelected: (ponto: Ponto) => boolean
}) {
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        if(!editMode) return;
        addAuxPoint(e.latlng.lat, e.latlng.lng);
      },
      contextmenu(e) {
        e.originalEvent.preventDefault();
      }
    });

    return null;
  }

  const pointAuxStyle = L.divIcon({
    className: "",
    html: `
      <div
        style="
          width: 12px;
          height: 12px;
          background: white;
          border: 2px solid black;
          border-radius: 50%;
        "
      ></div>
    `,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });

  const buttonStyle = "px-5 py-1 flex items-center gap-2 font-bold text-white rounded-sm";

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

          <MapClickHandler />
          <PontosOnMap 
            pontos={points}
            onClick={(point: Ponto) => {
              if(!editMode) return;
              console.log(point);
              onSelectPoint(point);
            }}
            onContextMenu={(point: Ponto) => {
              if(!editMode) return;
              if(isPointSelected(point)) {
                onUnselectPoint(point);
              }
            }}
            selecionado={isPointSelected}
            destacado={() => false}
          />
          
          {route && route.pontos && 
            <>
              <Polyline positions={route.pontos.map((point) => point.coordenada)}/>
              {route.pontos.map((point, index) => {
                if(point.id) return null;
                return (
                  <Marker
                    key={index}
                    icon={pointAuxStyle}
                    position={point.coordenada}
                    draggable={true}
                    eventHandlers={{
                      dragend(e) {
                        const {lat, lng} = e.target.getLatLng();
                        if(onEditGeometry) onEditGeometry(index, [lat, lng]);
                      },
                      contextmenu() {
                        removeAuxPoint(index)
                      }
                    }}
                  />
             )})}
            </>
          
          }
      </MapContainer>
    </div>
  )
}