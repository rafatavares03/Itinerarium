import { Ponto } from "@/types/ponto"
import { BusRoute } from "@/types/busRoute"
import prisma from "@/lib/prisma";

type RouteQuery = {
  id: number;
  ativo: boolean;
  linha: number;
  vigencia: Date | null;
  updated_at: Date;
  geometria: string;
  ponto_id: number;
  ordem: number;
  final: boolean;
  logradouro: string;
  numero: string;
  cidade: number;
  latitude: number;
  longitude: number;
}

type RouteWithGeometry = BusRoute & {
  geometria: {
    type: string;
    coordinates: [number, number][];
  };
}

function reduceQueryIntoRouteWithGeometry(routeQuery: RouteQuery[]): RouteWithGeometry[] {
  const routeWithGeometry = routeQuery.reduce<RouteWithGeometry[]>((acc, row) => {
    // find the route in the accumulator
    let route = acc.find((r) => r.id === row.id);

    
    // add the route if it isn't there
    if (!route) {
      route = {
        id: row.id,
        ativo: row.ativo,
        linha: row.linha,
        vigencia: row.vigencia,
        updated_at: row.updated_at,
        geometria: JSON.parse(row.geometria),
        pontos: []
      };

      acc.push(route);
    }

    // add bustops on the route it belongs
    if (row.ponto_id !== null) {
      route.pontos.push({
        id: row.ponto_id,
        logradouro: row.logradouro,
        numero: row.numero,
        cidade_id: row.cidade,
        coordenada: [
          row.longitude,
          row.latitude
        ],
        ordem: row.ordem,
        final: row.final
      });
    }

    return acc;
  }, []);

  return routeWithGeometry;
}

function transformIntoBusRoutes(routes: RouteWithGeometry[]): BusRoute[] {
  const busRoutes = routes.map((route) => {
    const coordinates: [number, number][] = route.geometria.coordinates || [];
    const points = coordinates.map(([longitude, latitude]) => {
      const persistedPoint = route.pontos.find((p) => {
        const lngDiff = Math.abs(p.coordenada[0] - longitude);
        const latDiff = Math.abs(p.coordenada[1] - latitude);

        return lngDiff < 0.00001 && latDiff < 0.00001;
      })

      if(persistedPoint) {
        return persistedPoint;
      }

      return {
        coordenada: [longitude, latitude] as [number, number]
      }
    });

    return {
      id: route.id,
      ativo: route.ativo,
      linha: route.linha,
      vigencia: route.vigencia,
      updated_at: route.updated_at,
      pontos: points,
    }
  });

  return busRoutes;
}

export async function getBusRouteById(id: number) {
  const query = await prisma.$queryRaw<RouteQuery[]>`
    SELECT
      t.id,
      t.ativo,
      t.linha,
      t.vigencia,
      t.updated_at,
      ST_AsGeoJSON(t.geometria) AS geometria,

      p.id AS ponto_id,
      pt.ordem,
      pt.final,
      p.logradouro,
      p.numero,
      p.cidade,
      ST_Y(p.coordenada) AS latitude,
      ST_X(p.coordenada) AS longitude
    
    FROM trajeto t 
      LEFT JOIN ponto_trajeto pt ON pt.trajeto = t.id 
      LEFT JOIN ponto p ON p.id = pt.ponto

    WHERE t.id = ${id}
  `;

  const routeWithGeometry = reduceQueryIntoRouteWithGeometry(query);
  const busRoutes = transformIntoBusRoutes(routeWithGeometry);

  return busRoutes[0];
}


export async function getBusRoutesByLine(line: number) {
  const query = await prisma.$queryRaw<RouteQuery[]>`
    SELECT
      t.id,
      t.ativo,
      t.linha,
      t.vigencia,
      t.updated_at,
      ST_AsGeoJSON(t.geometria) AS geometria,

      p.id AS ponto_id,
      pt.ordem,
      pt.final,
      p.logradouro,
      p.numero,
      p.cidade,
      ST_Y(p.coordenada) AS latitude,
      ST_X(p.coordenada) AS longitude

    FROM trajeto t 
      LEFT JOIN ponto_trajeto pt ON pt.trajeto = t.id 
      LEFT JOIN ponto p ON p.id = pt.ponto

    WHERE t.linha = ${line}

    ORDER BY t.id, pt.ordem
  `;

  const routesWithGeometry = reduceQueryIntoRouteWithGeometry(query);
  const busRoutes = transformIntoBusRoutes(routesWithGeometry)

  return busRoutes;
}

export async function createRoute(data: {
  active: boolean,
  line: number,
  period?: Date,
  busStops: Ponto[]
}) {
  const {
    active,
    line,
    period,
    busStops
  } = data;
  const registeredBusStops = busStops.filter(busStop => busStop.id !== undefined)
                                      .map((busStop, index) => ({
                                        ponto_id: busStop.id,
                                        ordem: index + 1,
                                        final: false
                                      }));
  
  registeredBusStops[registeredBusStops.length - 1].final = true;

  const geometry = {
    type: "LineString",
    coordinates: busStops.map((busStop) => busStop.coordenada)
  }

    const res = await prisma.$transaction(async (tx) => {
      const route = await tx.$queryRaw<{ id: number }[]>`
        INSERT INTO trajeto (
          linha,
          ativo,
          vigencia,
          geometria
        )
        VALUES (
          ${line},
          ${active},
          ${period ?? null},
          ST_SetSRID(
            ST_GeomFromGeoJSON(${JSON.stringify(geometry)}),
            4674
          )
        )
        RETURNING id
      `;

      const id = route[0].id;

      await tx.pontoTrajeto.createMany({
        data: registeredBusStops.map((busStop) => ({
          ponto_id: busStop.ponto_id!,
          trajeto_id: id,
          ordem: busStop.ordem,
          final: busStop.final
        }))
      });

      return id;
  });

  return res;
}

export async function deleteRoute(id: number) {
  return await prisma.trajeto.delete({
    where: {
      id: id
    }
  });
}