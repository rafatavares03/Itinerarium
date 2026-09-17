import { Ponto } from "@/types/ponto"
import prisma from "@/lib/prisma";

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

