import { Ponto } from "@/types/ponto"
import GoBackButton from "@/app/components/goBackButton";

export default function BusRouteDetails({
  busStops,
  onBackClick,
}: {
  busStops: Ponto[],
  onBackClick: () => void,
}) {
  return (
    <div>
      <div className="px-5 pt-5">
        <GoBackButton onClick={onBackClick} style="text-icy-aqua-400 size-[30px]"/>
      </div>
      <div className="p-2">
        {busStops.map((busStop, idx) =>
          <div key={busStop.id} className="text-icy-aqua-100">
            <span className="font-bold">{idx+1}</span> - {busStop.logradouro}, {busStop.numero}
          </div>
        )}
      </div>
    </div>
  );
}