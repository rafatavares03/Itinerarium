export type BusRoute = {
  id: number;
  ativo: boolean;
  linha: number;
  vigencia: Date | null;
  updated_at: Date;
  pontos: {
    id?: number;
    logradouro?: string;
    numero?: string;
    cidade_id?: number;
    coordenada: [number, number];
    ordem?: number;
    final?: boolean;
  }[];
};