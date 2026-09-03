export type CidadeBasic = {
  id: number,
  nome: string,
  uf: string
}

export type CidadeDetails = {
  id: number,
  nome: string,
  uf: string,
  enquadramento: [
    [minLat: number, minLong: number],
    [maxLat: number, maxLong: number]
  ]
}