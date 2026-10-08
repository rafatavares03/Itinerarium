import prisma from "@/lib/prisma";
import { BusSchedule } from "@/types/busSchedule";

export async function saveSchedule(schedule: BusSchedule[]) {
  const line = schedule[0].linha;
  return await prisma.$transaction(async (tx) => {
    await tx.horario.deleteMany({
      where: {
        linha_id: line
      }
    })

    return await tx.horario.createMany({
      data: schedule.map(({hora, ida, linha}) => ({
        hora,
        ida,
        linha_id: linha
      }))
    })
  })
}

export async function getSchedule(line: number) {
  return await prisma.horario.findMany({
    where: {
      linha_id: line
    },
    orderBy: {
      hora: "asc"
    }
  })
}