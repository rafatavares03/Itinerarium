import { useEffect, useState } from "react";
import { BusRoute } from "@/types/busRoute";
import { MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";

export default function BusRouteList({
  routes,
  current,
  onSelectRoute,
  onDeleteRoute,
  onDetails,
}: {
  routes: BusRoute[],
  current: number,
  onSelectRoute: (route: BusRoute) => void,
  onDeleteRoute: (route: BusRoute) => void,
  onDetails: () => void
}) {

 const [currentTime, setCurrentTime] = useState(new Date());

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentTime(new Date());
  }, 60_000);

  return () => clearInterval(interval);
}, []);

function formatRemainingTime(expiration: Date | string) {
  const expirationDate = new Date(expiration);
  const difference = expirationDate.getTime() - currentTime.getTime();

  if(difference <= 0) {
    return "expired";
  }

  const totalMinutes = Math.floor(difference / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if(days > 0) {
    return `${days}d ${hours}h`;
  }

  if(hours > 0) {
    return `${hours}h ${minutes}min`;
  }

  return `${minutes}min`;
}

  const routeActiveStyle = " bg-red-500";
  const buttonStyle = "cursor-pointer transition-all "
  const spanStyle = "bg-icy-aqua-100 text-space-indigo-700 text-xs font-display font-semibold px-2 rounded-md uppercase"

  return (
    <div className="flex flex-col gap-2 h-full">
      {routes.map((route, idx) => 
        <div key={route.id} className="relative">
          <button type="button" onClick={() => onSelectRoute(route)}
            className={"bg-icy-aqua-300 flex justify-between items-center w-4/5 px-3 rounded-e-lg transition-all text-start hover:w-5/6" 
                        + ((route.id === current) ? routeActiveStyle : " ")
            }>
              <p>Trajeto <span>{idx+1}</span></p>
              {route.ativo && 
                <span className={spanStyle}>
                  ativo
                </span>}

              {route.vigencia && new Date(route.vigencia) > currentTime
                ? <span className={spanStyle}>{formatRemainingTime(route.vigencia)}</span>: ""}
          </button>
          <div className="absolute top-0 bottom-0 flex items-center right-0 gap-1 px-2">
            <button type="button"
              className={buttonStyle + ((route.id !== current) ? "opacity-0 duration-0" : "opacity-100 duration-[3s]")}
              onClick={onDetails}
              >
              <FaEye className="text-icy-aqua-100 size-[20px]"/>
            </button>
            <button type="button" 
              className={buttonStyle + ((route.id !== current) ? "opacity-0 duration-0" : "opacity-100 duration-[3s]")}
              onClick={() => onDeleteRoute(route)}
              >
              <MdDelete className="text-red-500 size-[20px]"/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}