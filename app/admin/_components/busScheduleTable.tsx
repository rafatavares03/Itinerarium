import { EditableSchedule } from "./busScheduleManager";
import { MdDelete } from "react-icons/md";

export default function ScheduleTable({
  title,
  schedules,
  onAddSchedule,
  onTimeChange,
  onRemoveSchedule,
}: {
  title: string;
  schedules: EditableSchedule[];
  onAddSchedule: () => void;
  onTimeChange: (tempId: string, newTime: string) => void;
  onRemoveSchedule: (tempId: string) => void;
}) {
  const h3Style = "text-center font-semibold bg-icy-aqua-600 text-dusty-grape-50 font-display py-1 w-full";
  const addButtonStyle = "bg-icy-aqua-700 text-dusty-grape-50 py-1 px-3 my-2 mx-auto block rounded cursor-pointer hover:bg-icy-aqua-800 transition-colors";
  const deleteButtonStyle = "bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors cursor-pointer text-sm";

  return (
    <div className="flex-1 flex flex-col items-center">
      <h3 className={h3Style}>{title}</h3>
      <div className="flex flex-col items-center w-full pb-4">
        <button onClick={onAddSchedule} className={addButtonStyle}>
          + Adicionar Horário
        </button>
        <table className="border-collapse text-center">
          <tbody>
            {schedules.map((item) => (
              <tr key={item.tempId}>
                <td className="p-2 flex items-center gap-3">
                  <input
                    type="time"
                    value={item.hora}
                    onChange={(e) => onTimeChange(item.tempId, e.target.value)}
                    className="border rounded px-2 py-1 text-center bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveSchedule(item.tempId)}
                    title="Remover horário"
                  >
                    <MdDelete className="text-red-500 size-[25px]"/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}