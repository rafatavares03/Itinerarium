import { useEffect, useState } from "react";
import { getCitiesAction } from "@/lib/services/cityService";
import { CidadeBasic } from "@/types/cidade";

export function useCityList() {
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
  }, []);

  return {cities, loading};
}