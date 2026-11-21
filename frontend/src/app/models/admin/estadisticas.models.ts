import { Solicitud } from './solicitud.model';

/** Usuarios registrados y traducciones realizadas durante un mes. */
export interface ActividadMensual {
  /** Mes en formato yyyy-MM. */
  periodo: string;
  usuarios: number;
  traducciones: number;
}

/** Respuesta de GET /estadisticas. */
export interface Estadisticas {
  totalUsuarios: number;
  totalTraducciones: number;
  /** Cantidad de traducciones por lenguaje de destino. */
  traduccionesPorLenguaje: Record<string, number>;
  /** Últimos 6 meses, del más antiguo al actual. */
  actividadMensual: ActividadMensual[];
  /** Últimas traducciones, de la más reciente a la más antigua. */
  ultimasSolicitudes: Solicitud[];
}
