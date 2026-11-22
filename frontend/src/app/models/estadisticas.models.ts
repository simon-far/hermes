import { Solicitud } from './solicitud.model';

/** Usuarios registrados y traducciones realizadas durante un mes. */
export interface ActividadMensual {
  /** Mes en formato `yyyy-MM`. */
  periodo: string;
  /** Cantidad de usuarios registrados en el periodo. */
  usuarios: number;
  /** Cantidad de traducciones realizadas en el periodo. */
  traducciones: number;
}

/** Cantidad de solicitudes de un lenguaje, ya preparada para las gráficas del panel. */
export interface LenguajeConteo {
  /** Nombre o código del lenguaje de programación. */
  lenguaje: string;
  /** Número total de solicitudes asociadas al lenguaje. */
  cantidad: number;
  /** Porcentaje sobre el total de solicitudes (0-100). */
  porcentaje: number;
  /** Color hexadecimal o CSS con el que se dibuja en las gráficas. */
  color: string;
}

/** Respuesta de `GET /estadisticas` con las métricas globales del panel administrativo. */
export interface Estadisticas {
  /** Conteo total de cuentas registradas en la plataforma. */
  totalUsuarios: number;
  /** Conteo total de traducciones procesadas. */
  totalTraducciones: number;
  /** Cantidad de traducciones agrupadas por lenguaje de destino. */
  traduccionesPorLenguaje: Record<string, number>;
  /** Actividad de los últimos 6 meses, ordenada del más antiguo al actual. */
  actividadMensual: ActividadMensual[];
  /** Últimas traducciones registradas, de la más reciente a la más antigua. */
  ultimasSolicitudes: Solicitud[];
}
