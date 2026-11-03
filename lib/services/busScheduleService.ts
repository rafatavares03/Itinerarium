import { BusOperationAndSchedule } from "@/types/busSchedule";
import { getSchedule, saveSchedule } from "../repositories/busScheduleRepository";


export async function saveBusScheduleService(schedules: BusOperationAndSchedule[]) {
  if(schedules.length === 0) {
    return {
      success: false
    }
  }
  try {
    const res = await Promise.all(
      schedules.map(schedule => saveSchedule(schedule))
    )

    return {
      success: true,
      data: res
    }
  } catch(e) {
    console.log(e);
    return {
      sucess: false
    }
  }
}

export async function getBusScheduleService(line: number) {
  try {
    const res = await getSchedule(line);
    return {
      success: true,
      data: res
    }
  } catch(e) {
    console.log(e);
    return {
      success: false,
      data: []
    }
  }
}