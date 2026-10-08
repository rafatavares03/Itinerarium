import { useEffect, useState } from "react";
import { getBusScheduleAction, saveBusScheduleAction } from "../actions/busScheduleActions";
import { BusSchedule } from "@/types/busSchedule";
import ScheduleTable from "./busScheduleTable";

export type EditableSchedule = {
  tempId: string;
  linha: number;
  hora: string; 
  ida: boolean;
};

export default function BusScheduleManager({
  line,
  origin,
  destination
}: {
  line: number;
  origin: string;
  destination: string;
}) {
  const [schedule, setSchedule] = useState<EditableSchedule[]>([]);
  const outboundSchedules = schedule.filter((item) => item.ida);
  const returnSchedules = schedule.filter((item) => !item.ida);

  useEffect(() => {
    const loadData = async () => {
      const data = await getBusScheduleAction(line);
      if (data.success) {
        setSchedule(
          (data.data ?? []).map((item: any) => {
            let horaStr = "00:00";
            if (item.hora) {
              const d = new Date(item.hora);
              if (!isNaN(d.getTime())) {
                const h = String(d.getHours()).padStart(2, "0");
                const m = String(d.getMinutes()).padStart(2, "0");
                horaStr = `${h}:${m}`;
              }
            }

            return {
              ...item,
              hora: horaStr,
              tempId: crypto.randomUUID(),
            };
          })
        );
      }
    };

    if (line >= 0) loadData();
  }, [line]);

  function addSchedule(ida: boolean) {
    setSchedule((current) => [
      ...current,
      {
        tempId: crypto.randomUUID(),
        hora: "00:00",
        ida,
        linha: line,
      },
    ]);
  };

  function handleTimeChange(tempId: string, newTime: string) {
    setSchedule((current) =>
      current.map((item) =>
        item.tempId === tempId ? { ...item, hora: newTime } : item
      )
    );
  };

  const handleRemoveSchedule = (tempId: string) => {
    setSchedule((current) => current.filter((item) => item.tempId !== tempId));
  };

  async function saveSchedule() {
    const dataToSave: BusSchedule[] = schedule.map((item) => {
      const [hours, minutes] = item.hora.split(":").map(Number);

      const dateObj = new Date();
      dateObj.setHours(hours, minutes, 0, 0);

      return {
        linha: item.linha,
        ida: item.ida,
        hora: dateObj, 
      };
    });

    const response = await saveBusScheduleAction(dataToSave); 
  }

  if (line < 0) return null;

  return (
    <div className="flex flex-col border-2 border-icy-aqua-700 bg-icy-aqua-50 relative my-5">
      <h2 className="bg-icy-aqua-700 font-title text-semibold text-white tracking-widest rounded-t-md font-bold absolute top-[-25px] left-0 italic px-2">Horários</h2>
      <div className="flex gap-1 justify-around w-full">
        <div className="flex-1">
          <ScheduleTable
            onAddSchedule={() => addSchedule(true)}
            schedules={outboundSchedules}
            onTimeChange={handleTimeChange}
            title={origin}
            onRemoveSchedule={handleRemoveSchedule}
          />
        </div>
        <div className="flex-1">
          <ScheduleTable
            onAddSchedule={() => addSchedule(false)}
            schedules={returnSchedules}
            onTimeChange={handleTimeChange}
            title={destination}
            onRemoveSchedule={handleRemoveSchedule}
          />

        </div>
      </div>
      <button type="button" onClick={saveSchedule} 
        className="w-full bg-icy-aqua-700 text-icy-aqua-50 font-bold text-display"
      >
        Salvar
      </button>
    </div>
  );
}