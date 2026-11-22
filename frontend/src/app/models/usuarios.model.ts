/** Roles disponibles para las cuentas registradas en la plataforma. */
export type RolUsuario = 'USER' | 'ADMIN';

/** Representación de un usuario registrado en el sistema. */
export interface User {
  /** Identificador único del usuario. */
  id: number;
  /** Correo electrónico asociado a la cuenta. */
  email: string;
  /** Nombre de usuario utilizado para iniciar sesión. */
  username: string;
  /** Rol asignado al usuario dentro de la plataforma. */
  rol?: RolUsuario;
  /** Fecha ISO de registro; `null` en usuarios creados antes de existir la columna. */
  fechaRegistro?: string | null;
}

/** Datos que se envían al actualizar un usuario desde el panel de administración. */
export interface UsuarioActualizacion {
  /** Nuevo nombre de usuario. */
  username: string;
  /** Nuevo correo electrónico. */
  email: string;
  /** Rol asignado a la cuenta. */
  rol: RolUsuario;
  /** Opcional: si va vacío se conserva la contraseña actual. */
  password?: string;
}
