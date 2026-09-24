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
  removeAuxPoint,
  onSelectPoint,
  onUnselectPoint,
  onEditGeometry,
  isPointSelected,
}: {
  bounds: [[number,number], [number,number]],
  points: Ponto[],
  route: BusRoute | null, 
  addAuxPoint: (latitude:number, longitude:number) => void,
  removeAuxPoint: (idx: number) => void,
  onSelectPoint: (point: Ponto) => void,
  onUnselectPoint: (point: Ponto) => void,
  onEditGeometry: (idx: number, coordinates: [number, number]) => void
  isPointSelected: (ponto: Ponto) => boolean
}) {
  const [addOn, setAddOn] = useState(false);
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        if(!addOn) return;
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
      <div className="flex">
        <button type="button" 
          className={((addOn) ? "bg-red-500 " : "bg-lime-500 ") + buttonStyle + " absolute top-1 right-1 z-1000"}
          onClick={() => {setAddOn(!addOn)}}
          >
          <CiCirclePlus className="size-[30px]"/>
          {(addOn)? "Desabilitar inserção" : "Habilitar inserção"}
        </button>
      </div>
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
            onClick={onSelectPoint}
            onContextMenu={onUnselectPoint}
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