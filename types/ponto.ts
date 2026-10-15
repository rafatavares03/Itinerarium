export type Ponto = {
  id?: number
  logradouro: string,
  numero: string,
  cidade_id: number,
  time?: Date,
  coordenada: [number, number]
};