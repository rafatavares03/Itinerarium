import { BusSchedule } from "@/types/busSchedule";
import { useEffect, useState } from "react";
import { getBusScheduleAction } from "../actions/busScheduleActions";

export function useBusSchedule(line: string | number) {
  const [schedule, setSchedule] = useState<BusSchedule[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const res = await getBusScheduleAction(line);
      if(res.success) {
        setSchedule(res.data ?? []);
      }
    }

    loadData();
  }, [line]);

  return {schedule}
}