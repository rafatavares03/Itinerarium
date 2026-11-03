import prisma from "@/lib/prisma";
import { BusOperationAndSchedule } from "@/types/busSchedule";

export async function saveSchedule(schedule: BusOperationAndSchedule) {
  return await prisma.$transaction(async (tx) => {
    const operation = await tx.funcionamento.upsert({
      where: schedule.id 
      ? {
        id: schedule.id
      }
      : {
        linha_id_nome: {
          linha_id: schedule.linha,
          nome: schedule.nome
        }
      },
      update: {
        nome: schedule.nome,
        descricao: schedule.descricao
      },
      create: {
        nome: schedule.nome,
        descricao: schedule.descricao,
        linha_id: schedule.linha
      }
    })

    await tx.horario.deleteMany({
      where: {
        funcionamento_id: operation.id
      }
    });

    const schedules = await tx.horario.createMany({
      data: schedule.horarios.map(schedule => ({
        hora: schedule.hora,
        ida: schedule.ida,
        funcionamento_id: operation.id
      }))
    })

    return {
      id: operation.id,
      nome: operation.nome,
      descricao: operation.descricao,
      linha: operation.linha_id,
      horarios: schedule.horarios.map(hour => ({
        ...hour,
        funcionamento: operation.id
      }))
    }
  })
}

export async function getSchedule(line: number) {
  const query = await prisma.funcionamento.findMany({
    where: {
      linha_id: line
    },
    include: {
      horarios: {
        orderBy: {
          hora: "asc"
        }
      }
    }
  })

  return query.map((schedule) => ({
    ...schedule,
    linha: schedule.linha_id,
    horarios: schedule.horarios.map(hour => ({
      ...hour,
      funcionamento: hour.funcionamento_id
    }))
  }))
}