import { Ponto } from "@/types/ponto";
import { BusRoute } from "@/types/busRoute";
import { 
  createRoute, 
  editRoute, 
  deleteRoute, 
  getBusRouteById, 
  getBusRoutesByLine,
  activateRoute,
  temporarilyActivateRoute
} from "../repositories/busRouteRepository"
import { success } from "zod";

export async function getBusRoutesService(line: number) {
  try{
    const res = await getBusRoutesByLine(line);
    return {
      success: true,
      data: res
    }
  } catch(e) {
    return {
      success: false,
      message: "Não foi possível buscar rotas dessa linha."
    }
  }
}

export async function createRouteService(data: {
  active: boolean,
  line: number,
  isOutbound: boolean,
  period?: Date,
  busStops: Ponto[]
}) {
  try {
    const id = await createRoute(data);
    const routeData = await getBusRouteById(id);
    return {
      success: true,
      data: routeData
    }
  } catch(e) {
    console.log(e);
    return {
      success: false,
      message: "Não foi possível salvar rota"
    }
  }
}

export async function deleteRouteService(id: number) {
  try {
    const res = deleteRoute(id);
    return {
      success: true,
      data: res
    }
  } catch(e) {
    console.log(e);
    return {
      success: false,
      message: "Não foi possível apagar a rota"
    }
  }
}

export async function editRouteService(data: BusRoute) {
   try {
    const lastRegisteredIndex = data.pontos.reduce((lastIndex, point, index) => 
      point.id !== undefined ? index : lastIndex, -1
    );

    let order = 1;

    const pontos = data.pontos.map((point, index) => {
      if (point.id === undefined) {
        return point;
      }

      return {
        ...point,
        ordem: order++,
        final: index === lastRegisteredIndex
      };
    });

     await editRoute({
      ...data,
      pontos
    });

    const routeData = await getBusRouteById(data.id);

    return {
      success: true,
      data: routeData
    };
  } catch (e) {
    console.log(e);

    return {
      success: false,
      message: "Não foi possível editar a rota"
    };
  }
}

export async function activateRouteService(data: BusRoute) {
  try {
    activateRoute(data);
    return {
      success: true,
    }
  } catch(e) {
    console.log(e);
    return {
      success: false
    }
  }
}

export async function temporarilyActivateRouteService(data: BusRoute, date: Date) {
  try {
    temporarilyActivateRoute(data, date);
    return {
      success: true
    }
  } catch(e) {
    console.log(e);
    return {success: false}
  }
}