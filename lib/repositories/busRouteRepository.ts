import { Ponto } from "@/types/ponto"
import { BusRoute } from "@/types/busRoute"
import prisma from "@/lib/prisma";

type RouteQuery = {
  trajeto_id: number;
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

export async function getBusRoutesByLine(line: number) {
  const routes = await prisma.$queryRaw<RouteQuery[]>`
    SELECT
      t.id AS trajeto_id,
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

    LEFT JOIN ponto_trajeto pt
      ON pt.trajeto = t.id

    LEFT JOIN ponto p
      ON p.id = pt.ponto

    WHERE t.linha = ${line}

    ORDER BY t.id, pt.ordem
`;

  const resultado = routes.reduce<BusRoute[]>((acc, row) => {
    let trajeto = acc.find(
      (t) => t.id === row.trajeto_id
    );

    if (!trajeto) {
      trajeto = {
        id: row.trajeto_id,
        ativo: row.ativo,
        linha: row.linha,
        vigencia: row.vigencia,
        updated_at: row.updated_at,
        geometria: JSON.parse(row.geometria),
        pontos: []
      };

      acc.push(trajeto);
    }

    if (row.ponto_id !== null) {
      trajeto.pontos.push({
        id: row.ponto_id,
        logradouro: row.logradouro,
        numero: row.numero,
        cidade_id: row.cidade,
        coordenada: [
          row.latitude,
          row.longitude
        ],
        ordem: row.ordem,
        final: row.final
      });
    }

    return acc;
  }, []);

  return resultado;
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

