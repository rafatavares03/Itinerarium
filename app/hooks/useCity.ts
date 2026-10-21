import { useState, useEffect } from "react";
import { getCityAction } from "@/app/actions/cityActions"; 
import { CidadeDetails } from "@/types/cidade"; 

export function useCity(cityId: number | string | undefined) {
  const [city, setCity] = useState<CidadeDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cityId) {
      setLoading(false);
      return;
    }

    const fetchCity = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const numericId = typeof cityId === "string" ? parseInt(cityId, 10) : cityId;
        const cityData = await getCityAction(numericId);
        if (cityData?.success) {
          setCity(cityData.data?.city ?? null);
        } else {
          setError("Não foi possível carregar os dados da cidade.");
        }
      } catch (err) {
        setError("Erro inesperado ao buscar a cidade.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCity();
  }, [cityId]);

  return { city, loading, error };
}