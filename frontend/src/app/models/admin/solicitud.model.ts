/**
 * Traducción vista desde el panel de administración (GET /estadisticas/solicitudes).
 * No incluye el código: es información privada del usuario.
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
