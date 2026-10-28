import { BusSchedule } from "@/types/busSchedule";


export default function ScheduleTableView({
  schedule,
  title
}: {
  schedule: BusSchedule[],
  title: string
}) {
  return (
    <table className="text-white h-fit text-center w-[300px]">
      <thead>
        <tr>
          <th className="bg-icy-aqua-500 border-1 border-white text-space-indigo-800">
            {title}
          </th>
        </tr>
      </thead>
      <tbody>
        {schedule
          .map((hour) => {
            const hours = hour.hora.getHours().toString().padStart(2, "0");
            const minutes = hour.hora.getMinutes().toString().padStart(2, "0");

            return (
              <tr key={hour.hora.toISOString()}>
                <td className="p-1 border-1 border-icy-aqua-500">
                  {`${hours}:${minutes}`}
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}