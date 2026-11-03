export type BusOperation = {
  id?: number,
  nome: string,
  descricao?: string | null,
  linha: number
}

export type Schedule = {
  funcionamento?: number,
  hora: Date,
  ida: boolean
}

export type BusOperationAndSchedule = BusOperation & {
  horarios: Schedule[]
}