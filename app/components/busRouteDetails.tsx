import { Ponto } from "@/types/ponto"
import GoBackButton from "@/app/components/goBackButton";

export default function BusRouteDetails({
  busStops,
  onBackClick,
  onActivateRoute
}: {
  busStops: Ponto[],
  onBackClick?: () => void,
  onActivateRoute?: () => void
}) {
  if(!busStops) {
    return;
  }

  return (
    <div>
      <div className="flex justify-between py-2 px-5">
        {onBackClick && <GoBackButton onClick={onBackClick} style="text-icy-aqua-400 size-[30px]"/>}
        <h2 className="font-bold text-center text-icy-aqua-100 w-full text-lg">Pontos</h2>
        {onActivateRoute &&
          <button type="button" 
          className="bg-icy-aqua-100 text-icy-aqua-700 uppercase px-2 rounded-md text-xs font-bold cursor-pointer border-2 transition duration-500
          hover:text-icy-aqua-100 hover:bg-icy-aqua-700
          "
          onClick={onActivateRoute}
          >
            Ativar
          </button>
        }
      </div>
      <div className="p-2 overflow-auto">
        {busStops.map((busStop, idx) =>
          <div key={busStop.id} className="text-icy-aqua-100">
            <span className="font-bold">{idx+1}</span> - {busStop.logradouro}, {busStop.numero}
          </div>
        )}
      </div>
    </div>
  );
}