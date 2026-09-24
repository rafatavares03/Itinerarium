import { BusRoute } from "@/types/busRoute"
import { MdDelete } from "react-icons/md";

export default function BusRouteList({
  routes,
  current,
  onSelectRoute,
  onDeleteRoute
}: {
  routes: BusRoute[],
  current: number,
  onSelectRoute: (route: BusRoute) => void,
  onDeleteRoute: (route: BusRoute) => void
}) {

  const routeActiveStyle = " bg-red-500";

  return (
    <div className="flex flex-col gap-2">
      {routes.map((route, idx) => 
        <div key={route.id} className="relative">
          <button type="button" onClick={() => onSelectRoute(route)}
            className={"bg-icy-aqua-300 w-4/5 px-3 rounded-e-lg transition-all text-start hover:w-5/6" 
                        + ((route.id === current) ? routeActiveStyle : " ")
            }>
              Rota <span>{idx+1}</span>
          </button>
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