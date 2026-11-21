/** Credenciales enviadas al backend para iniciar sesión. */
export interface LoginModel {
  /** Nombre de usuario registrado en la plataforma. */
  username: string;
  /** Contraseña asociada a la cuenta. */
  password: string;
}
