'use client'

import { getCitiesAction } from "@/lib/services/cityService";
import { CidadeBasic } from "@/types/cidade";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<CidadeBasic[]>([]);

  useEffect(() => {
    const loadCities = async () => {
      setLoading(true);
      const data = await getCitiesAction({quantidade: 15});
      if(data.success) {
        if(data.cidades) {
          setCities(data.cidades);
        }
      }
      setLoading(false);
    }

    loadCities()
  }, [])

  if (status === 'loading') {
    return <p>Carregando sessão...</p>
  }

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
  );
}
