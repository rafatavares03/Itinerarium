'use client';

import { useState, useEffect } from "react";
import { getCityAction } from "@/app/actions/cityActions";
import { getBusStopsAction } from "@/app/actions/busStopActions"; 
import { CidadeDetails } from "@/types/cidade"; 
import { Ponto } from "@/types/ponto"; 

export function useCityData(cityId: string | number | undefined) {
  const [city, setCity] = useState<CidadeDetails | null>(null);
  const [busStops, setBusStops] = useState<Ponto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cityId) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const numericId = typeof cityId === 'string' ? parseInt(cityId, 10) : cityId;

        const [cityResponse, busStopsResponse] = await Promise.all([
          getCityAction(numericId),
          getBusStopsAction({ city: numericId })
        ]);

        if (cityResponse.success) {
          setCity(cityResponse.data?.city ?? null);
        }

        if (busStopsResponse.success) {
          setBusStops(busStopsResponse.data?.busStops ?? []);
        }
      } catch (err) {
        setError("Erro ao carregar os dados da cidade.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [cityId]);

  return { city,setCity, busStops, setBusStops, loading, error };
}