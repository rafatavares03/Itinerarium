'use client'

import { useEffect, useState } from "react";
import { BusLineBasic } from "@/types/busLine";
import { getBusLinesAction } from "../actions/busLineActions";

export function useBusLines(cityId?: number) {
  const [busLines, setBusLines] = useState<BusLineBasic[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if(!cityId) return;
      setLoading(true);
      const res = await getBusLinesAction(cityId, {});
      if(res.success) {
        setBusLines(res.data ?? []);
      }
      setLoading(false);
    }

    loadData();
  }, [cityId]);

  return {busLines, setBusLines, loading};
}