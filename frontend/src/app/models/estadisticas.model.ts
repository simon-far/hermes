export interface Estadisticas {
  totalUsuarios: number;
  totalTraducciones: number;
  traduccionesPorLenguaje: { [lenguaje: string]: number };
}
