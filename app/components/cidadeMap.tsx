'use client'

import { MapContainer, TileLayer } from "react-leaflet"

export default function CidadeMap({
  center
}: {
  center: [number, number]
}) {
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
      </MapContainer>
    </>
  )
}