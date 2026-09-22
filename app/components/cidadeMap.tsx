'use client'

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

export default function CidadeMap({
  bounds,
  pontos,
  rota,
  novos,
  pontoDestaque,
  onMapClick,
  onSelectPoint,
  onDeleteNew,
  isPointSelected,
  isPointHighlighted
}: {
  bounds: [[number,number], [number,number]],
  pontos: Ponto[],
  rota?: Ponto[], 
  novos?: Ponto[],
  pontoDestaque: Ponto | null,
  onMapClick: (latitude:number, longitude:number) => void,
  onSelectPoint: (ponto: Ponto) => void,
  onDeleteNew: (ponto: Ponto) => void,
  isPointSelected: (ponto: Ponto) => boolean
  isPointHighlighted: (ponto: Ponto) => boolean
}) {
  const [addOn, setAddOn] = useState(false);
  console.log("ROTA:", rota)
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        console.log("Centralizando:", pontoDestaque);
        if(!addOn) return;
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
            pontos={pontos}
            novos={novos}
            onSelectPoint={onSelectPoint}
            onDeleteNew={onDeleteNew}
            selecionado={isPointSelected}
            destacado={isPointHighlighted}
          />
          
          {rota && 
            <>
              <Polyline positions={rota.map((ponto) => ponto.coordenada)}/>
              {rota.map((ponto, index) => {
                if(ponto.id) return null;
                return (
                  <Marker
                    key={index}
                    position={ponto.coordenada}
                    draggable={true}
                    eventHandlers={{
                      dragend(e) {
                        const novaPosicao = e.target.getLatLng();
                        console.log(`Ponto ${index} foi para:`, novaPosicao.lat, novaPosicao.lng);

                        // AQUI você vai chamar a função para atualizar seu estado/banco
                      },
                    }}
                  />
             )})}
            </>
          
          }
          <CentralizarPonto ponto={pontoDestaque} />
      </MapContainer>
    </div>
  )
}