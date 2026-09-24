import { BusRoute } from "@/types/busRoute"
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

  const routeActiveStyle = " bg-red-500";

  return (
    <div className="flex flex-col gap-2 h-full">
      {routes.map((route, idx) => 
        <div key={route.id} className="relative">
          <button type="button" onClick={() => onSelectRoute(route)}
            className={"bg-icy-aqua-300 w-4/5 px-3 rounded-e-lg transition-all text-start hover:w-5/6" 
                        + ((route.id === current) ? routeActiveStyle : " ")
            }>
              Rota <span>{idx+1}</span>
          </button>
          <div className="absolute top-0 bottom-0 flex items-center right-0 gap-1 px-2">

            <button type="button"
              className="cursor-pointer"
              onClick={onDetails}
              >
              <FaEye className="text-icy-aqua-100 size-[20px]"/>
            </button>
            <button type="button" 
              className="cursor-pointer"
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