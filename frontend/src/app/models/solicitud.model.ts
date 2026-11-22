/**
 * Traducción vista desde el panel de administración (GET /estadisticas/solicitudes).
 * No incluye el código; para verlo se pide el detalle de la solicitud.
 */
export interface Solicitud {
  id: number;
  usuario: string;
  correo: string;
  lenguajeOrigen: string | null;
  lenguajeDestino: string | null;
  modelo: string | null;
  /** Fecha ISO enviada por el backend (LocalDateTime). */
  fecha: string | null;
}

/** Detalle completo de una solicitud (GET /estadisticas/solicitudes/{id}). */
export interface SolicitudDetalle extends Solicitud {
  /** Código enviado por el usuario. */
  codigoOriginal: string | null;
  /** Código resultante de la traducción. */
  codigoTraducido: string | null;
  /** Mejoras sugeridas por la IA. */
  mejoras: string[];
}
