import { Solicitud } from './solicitud.model';

/** Usuarios registrados y traducciones realizadas durante un mes. */
export interface ActividadMensual {
  /** Mes en formato yyyy-MM. */
  periodo: string;
  usuarios: number;
  traducciones: number;
}

/** Cantidad de solicitudes de un lenguaje, ya preparada para las gráficas del panel. */
export interface LenguajeConteo {
  lenguaje: string;
  cantidad: number;
  /** Porcentaje sobre el total de solicitudes (0-100). */
  porcentaje: number;
  /** Color con el que se dibuja en las gráficas. */
  color: string;
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
