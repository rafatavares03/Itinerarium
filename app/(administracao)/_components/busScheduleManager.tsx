import { useEffect, useState } from "react";
import { getBusScheduleAction, saveBusScheduleAction } from "../../actions/busScheduleActions";
import { Schedule } from "@/types/busSchedule";
import Modal from "@/app/components/modal";
import ScheduleTable from "./busScheduleTable";
import { IoIosCloseCircle } from "react-icons/io";

export type EditableSchedule = {
  tempId: string;
  linha: number;
  hora: string; 
  ida: boolean;
};

type EditableOperation = {
  id?: number,
  nome: string;
  tempId: string;
  descricao?: string;
  linha: number;
  horarios: EditableSchedule[];
} 

export default function BusScheduleManager({
  line,
  origin,
  destination
}: {
  line: number;
  origin: string;
  destination: string;
}) {
  const [schedule, setSchedule] = useState<EditableOperation[]>([]);
  const [scheduleSelected, setScheduleSelected] = useState(0);
  const [addOperation, setAddOperation] = useState(false);
  const [newOperation, setNewOperation] = useState({
    nome: "",
    descricao: "",
  });
  const outboundSchedules = (schedule.length === 0) ? [] : schedule[scheduleSelected].horarios.filter((item) => item.ida);
  const returnSchedules = (schedule.length === 0) ? [] : schedule[scheduleSelected].horarios.filter((item) => !item.ida);

  useEffect(() => {
    const loadData = async () => {
      const data = await getBusScheduleAction(line);
      if (data.success) {
        console.log(data.data);
        // setSchedule(
        //   (data.data ?? []).map((item: any) => {
        //     let horaStr = "00:00";
        //     if (item.hora) {
        //       const d = new Date(item.hora);
        //       if (!isNaN(d.getTime())) {
        //         const h = String(d.getHours()).padStart(2, "0");
        //         const m = String(d.getMinutes()).padStart(2, "0");
        //         horaStr = `${h}:${m}`;
        //       }
        //     }

        //     return {
        //       ...item,
        //       hora: horaStr,
        //       tempId: crypto.randomUUID(),
        //     };
        //   })
        // );
      }
    };

    if (line >= 0) loadData();
  }, [line]);

  // function addSchedule(ida: boolean) {
  //   setSchedule((current) => [
  //     ...current,
  //     {
  //       tempId: crypto.randomUUID(),
  //       hora: "00:00",
  //       ida,
  //       linha: line,
  //     },
  //   ]);
  // };

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

  function addNewOperation() {
    setSchedule((current) => [
      ...current,
      {
        nome: newOperation.nome,
        descricao: newOperation.descricao,
        linha: line,
        tempId: crypto.randomUUID(),
        horarios: []
      }
    ]);
    setNewOperation({
      nome: "",
      descricao: "",
    });
    setAddOperation(false);
  }

  async function saveSchedule() {
    if(schedule.length === 0) return;
    const dataToSave: Schedule[] = schedule[scheduleSelected].horarios.map((item) => {
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

  function addSchedule(bool: boolean) {
    return;
  }



  if (line < 0) return null;

  return (
    <div className="flex flex-col border-2 border-icy-aqua-700 bg-icy-aqua-50 relative my-5">
      <h2 className="bg-icy-aqua-700 font-title text-semibold text-white tracking-widest rounded-t-md font-bold absolute top-[-25px] left-0 italic px-2">Horários</h2>
      {schedule.length === 0 ?
        <div>
          <p>Nenhum período de funcionamento adicionado ainda.</p>
          <button type="button" onClick={() => setAddOperation(true)}>Adicionar</button>
        </div>
      :
        <>
          <div>
            {schedule.map(item => {
              return (
                <button type="button" key={item.tempId}>{item.nome}</button>
              )
            })}
          </div>
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
        </>
      }
      <Modal open={addOperation}>
        <div className="bg-space-indigo-800 p-10 flex flex-col rounded-lg relative w-3xl ">
          <button type="button" className="absolute top-[10px] right-[10px]" 
            onClick={() => {
              setAddOperation(false);
            }}
          >
            <IoIosCloseCircle className="text-icy-aqua-400 size-[30px]"/>
          </button>
          <div className="flex items-center gap-2">
            <label htmlFor="name">Nome:</label>
            <input type="text" name="name" id="name" placeholder="Segunda a sexta" 
              value={newOperation.nome} 
              onChange={(e) => setNewOperation((current) => ({
                ...current,
                nome: e.target.value
              }))}
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="description">Descrição (opcional):</label>
            <input type="text" name="description" id="description" 
              value={newOperation.descricao} 
              onChange={(e) => setNewOperation((current) => ({
                ...current,
                descricao: e.target.value
              }))}
            />
          </div>
          <button type="button" onClick={addNewOperation}>Adicionar</button>
        </div>
      </Modal>
    </div>
  );
}