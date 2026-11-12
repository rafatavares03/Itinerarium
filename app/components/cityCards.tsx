'use client'

import { useCityList } from "../hooks/useCityList";
import Link from "next/link";

export default function CityCards() {
  const {cities, loading} = useCityList();

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      {loading && <p>Carregando cidades...</p>}
      {!loading &&
        <div className="flex gap-3">
          {cities.map((city) => (
            <Link href={`/${city.id}`} key={city.id} 
              className="w-[200px] h-[100px] bg-space-indigo-700 flex items-center justify-center rounded-md"
            >
              <p className="font-semibold text-icy-aqua-100">{`${city.nome} - ${city.uf}`}</p>
            </Link>
          ))}
        </div>
      }
    </div>
  )
}