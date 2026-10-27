import {useState, useEffect } from "react";
import { BusLineBasic } from "@/types/busLine";
import { BusRoute } from "@/types/busRoute";
import { getLineAndRoutesAction } from "../actions/busRouteActions";

export default function useLineAndRoutes(cityId: string, lineCode: string) {
  const [line, setLine] = useState<BusLineBasic | null>(null);
  const [busRoutes, setBusRoutes] = useState<BusRoute[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await getLineAndRoutesAction(cityId, lineCode);
      if(data.success) {
        setLine(data.data?.line ?? null);
        setBusRoutes(data.data?.busRoutes ?? []);
      }
    }
    
    loadData();
  }, [cityId, lineCode]);

  return {line, busRoutes};
}