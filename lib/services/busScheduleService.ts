import { BusSchedule } from "@/types/busSchedule";
import { getSchedule, saveSchedule } from "../repositories/busScheduleRepository";


export async function saveBusScheduleService(schedule: BusSchedule[]) {
  if(schedule.length === 0) {
    return {
      success: false
    }
  }
  try {
    const res = await saveSchedule(schedule);
    if(res.count > 0) {
      return {
        success: true
      }
    }

    return {
      success: false
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