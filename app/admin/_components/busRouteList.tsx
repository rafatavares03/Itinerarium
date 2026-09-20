import { BusRoute } from "@/types/busRoute"
import { MdDelete } from "react-icons/md";

export default function BusRouteList({
  routes,
  onSelectRoute,
  onDeleteRoute
}: {
  routes: BusRoute[],
  onSelectRoute: (route: BusRoute) => void,
  onDeleteRoute: (route: BusRoute) => void
}) {

  return (
    <div className="flex flex-col gap-2">
      {routes.map((route, idx) => 
        <div key={idx} className="relative">
          <div className="bg-icy-aqua-300 w-4/5 px-3 rounded-e-lg transition-all hover:w-5/6">
            <button type="button" onClick={() => onSelectRoute(route)}>
              Rota <span>{idx+1}</span>
            </button>
          </div>
          <button type="button" 
            className="absolute right-2 top-0 cursor-pointer"
            onClick={() => onDeleteRoute(route)}
          >
            <MdDelete className="text-red-500 size-[20px]"/>
          </button>
        </div>
      )}
    </div>
  );
}