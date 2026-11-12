'use client'

import { useCityList } from "../hooks/useCityList";
import Link from "next/link";

export default function CityCards() {
  const {cities, loading} = useCityList();

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      {loading && <p>Carregando cidades...</p>}
      {!loading &&
        <div className="flex flex-col">
          {cities.map((city) => (
            <Link href={`/${city.id}`} key={city.id}>
              <p>{`${city.nome} - ${city.uf}`}</p>
            </Link>
          ))}
        </div>
      }
    </div>
  )
}