/** Respuesta devuelta por el backend tras una autenticación exitosa. */
export interface AnswerloginModel {
  /** Token JWT utilizado para autorizar solicitudes posteriores. */
  token: string;
  /** Rol asignado al usuario autenticado (ej. `'USER'` o `'ADMIN'`). */
  role: string;
}
