/** Datos enviados al backend para registrar una nueva cuenta de usuario. */
export interface RegisterModel {
  /** Nombre de usuario elegido para la cuenta. */
  username: string;
  /** Contraseña definida para el acceso. */
  password: string;
  /** Correo electrónico asociado al usuario. */
  email: string;
}
