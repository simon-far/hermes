<<<<<<< Updated upstream
import { Component } from '@angular/core';
interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  fechaRegistro: string;
  estado: 'Activo' | 'Inactivo';
}
=======
import { Component, computed, HostListener, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { RolUsuario, User, UsuarioActualizacion } from '../../../models/usuarios.model';
import { Opcion } from '../../../models/opcion.model';
import { UsuarioService } from '../../../services/usuario.service';
import { LoginService } from '../../../services/login.service';

/**
 * Componente para la gestión de usuarios desde el panel de administración.
 * Permite listar, buscar, actualizar datos y eliminar cuentas registradas.
 */
>>>>>>> Stashed changes
@Component({
  selector: 'app-usuariosadmincomponent',
  standalone: false,
  styleUrl: './usuariosadmincomponent.css',
  templateUrl: './usuariosadmincomponent.html',
})
<<<<<<< Updated upstream
export class Usuariosadmincomponent {
=======
export class Usuariosadmincomponent implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  private readonly loginServicio = inject(LoginService);
  private readonly snackBar = inject(MatSnackBar);

  /** Término de búsqueda ingresado para filtrar el directorio. */
>>>>>>> Stashed changes
  busqueda = '';
  filtroEstado: 'Todos' | 'Activo' | 'Inactivo' = 'Todos';

<<<<<<< Updated upstream
  usuarios: Usuario[] = [
    {
      id: 1,
      nombre: 'Laura Martínez',
      correo: 'laura.martinez@email.com',
      fechaRegistro: '12/09/2026',
      estado: 'Activo'
    },
    {
      id: 2,
      nombre: 'Carlos Rodríguez',
      correo: 'carlos.rodriguez@email.com',
      fechaRegistro: '18/09/2026',
      estado: 'Activo'
    },
    {
      id: 3,
      nombre: 'Andrés Gómez',
      correo: 'andres.gomez@email.com',
      fechaRegistro: '25/09/2026',
      estado: 'Inactivo'
    },
    {
      id: 4,
      nombre: 'Mariana López',
      correo: 'mariana.lopez@email.com',
      fechaRegistro: '02/10/2026',
      estado: 'Activo'
    },
    {
      id: 5,
      nombre: 'Daniel Herrera',
      correo: 'daniel.herrera@email.com',
      fechaRegistro: '08/10/2026',
      estado: 'Inactivo'
    },
    {
      id: 6,
      nombre: 'Sofía Ramírez',
      correo: 'sofia.ramirez@email.com',
      fechaRegistro: '15/10/2026',
      estado: 'Activo'
    }
  ];

  get usuariosFiltrados(): Usuario[] {
=======
  /** Listado completo de usuarios cargados desde el backend. */
  usuarios = signal<User[]>([]);

  /** Conteo total de usuarios registrados. */
  totalUsuarios = computed(() => this.usuarios().length);

  /** Nombre del administrador con sesión iniciada (no puede eliminarse a sí mismo). */
  readonly usuarioActual = this.loginServicio.obtenerUsuario();

  /** Opciones de roles disponibles en el formulario de edición. */
  readonly roles: Opcion<RolUsuario>[] = [
    { valor: 'USER', etiqueta: 'Usuario' },
    { valor: 'ADMIN', etiqueta: 'Administrador' },
  ];

  // Ventana de actualización
  usuarioEditando = signal<User | null>(null);
  formulario: UsuarioActualizacion = { username: '', email: '', rol: 'USER', password: '' };
  guardando = false;

  // Confirmación de eliminación
  usuarioAEliminar = signal<User | null>(null);
  eliminando = false;

  /**
   * Inicializa el componente cargando el directorio de usuarios.
   */
  ngOnInit(): void {
    this.cargarUsuarios();
  }

  /**
   * Consulta todos los usuarios registrados y actualiza el estado local.
   */
  cargarUsuarios(): void {
    this.usuarioService.getAll().subscribe({
      next: (respuesta) => {
        this.usuarios.set(Array.isArray(respuesta) ? respuesta : []);
      },
      error: (error) => {
        console.error('Error al consultar los usuarios:', error);
      },
    });
  }

  /**
   * Filtra los usuarios por nombre de usuario o correo según el término de búsqueda.
   * @returns Lista de usuarios que coinciden con el filtro actual.
   */
  get usuariosFiltrados(): User[] {
>>>>>>> Stashed changes
    const termino = this.busqueda.trim().toLowerCase();

    return this.usuarios.filter(usuario => {
      const coincideBusqueda =
        usuario.nombre.toLowerCase().includes(termino) ||
        usuario.correo.toLowerCase().includes(termino);

<<<<<<< Updated upstream
      const coincideEstado =
        this.filtroEstado === 'Todos' ||
        usuario.estado === this.filtroEstado;

      return coincideBusqueda && coincideEstado;
=======
  /**
   * Verifica si el usuario corresponde a la cuenta del administrador en sesión.
   * @param user Usuario a evaluar.
   * @returns `true` si coincide con el usuario autenticado.
   */
  esUsuarioActual(user: User): boolean {
    return !!this.usuarioActual && user.username === this.usuarioActual;
  }

  // ---------- Actualizar ----------

  /**
   * Precarga los datos del usuario seleccionado y abre el modal de edición.
   * @param user Usuario que se va a actualizar.
   */
  abrirEdicion(user: User): void {
    this.formulario = {
      username: user.username ?? '',
      email: user.email ?? '',
      rol: user.rol ?? 'USER',
      password: '',
    };
    this.usuarioEditando.set(user);
  }

  /**
   * Cierra el modal de edición siempre que no haya una operación de guardado en curso.
   */
  cerrarEdicion(): void {
    if (this.guardando) return;
    this.usuarioEditando.set(null);
  }

  /**
   * Valida el formulario, envía los cambios al backend y actualiza el registro en la lista local.
   * @param form Referencia al formulario template-driven de edición.
   */
  guardarCambios(form: NgForm): void {
    const usuario = this.usuarioEditando();
    if (!usuario || this.guardando) return;

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const datos: UsuarioActualizacion = {
      username: this.formulario.username.trim(),
      email: this.formulario.email.trim(),
      rol: this.formulario.rol,
    };
    if (this.formulario.password?.trim()) {
      datos.password = this.formulario.password;
    }

    this.guardando = true;
    this.usuarioService
      .actualizar(usuario.id, datos)
      .pipe(finalize(() => (this.guardando = false)))
      .subscribe({
        next: () => {
          this.usuarios.update((lista) =>
            lista.map((u) =>
              u.id === usuario.id
                ? { ...u, username: datos.username, email: datos.email, rol: datos.rol }
                : u
            )
          );
          this.usuarioEditando.set(null);
          this.mostrarMensaje('Usuario actualizado correctamente.', 'exito');
        },
        error: (error: HttpErrorResponse) => {
          this.mostrarMensaje(this.obtenerMensajeError(error, 'No fue posible actualizar el usuario.'), 'error');
        },
      });
  }

  // ---------- Eliminar ----------

  /**
   * Abre el modal de confirmación para eliminar un usuario.
   * @param user Usuario seleccionado para eliminación.
   */
  pedirConfirmacionEliminar(user: User): void {
    this.usuarioAEliminar.set(user);
  }

  /**
   * Cierra el modal de confirmación si no hay una eliminación en progreso.
   */
  cancelarEliminar(): void {
    if (this.eliminando) return;
    this.usuarioAEliminar.set(null);
  }

  /**
   * Ejecuta la eliminación del usuario seleccionado y lo remueve de la lista local.
   */
  confirmarEliminar(): void {
    const usuario = this.usuarioAEliminar();
    if (!usuario || this.eliminando) return;

    this.eliminando = true;
    this.usuarioService
      .eliminar(usuario.id)
      .pipe(finalize(() => (this.eliminando = false)))
      .subscribe({
        next: () => {
          this.usuarios.update((lista) => lista.filter((u) => u.id !== usuario.id));
          this.usuarioAEliminar.set(null);
          this.mostrarMensaje('Usuario eliminado correctamente.', 'exito');
        },
        error: (error: HttpErrorResponse) => {
          this.mostrarMensaje(this.obtenerMensajeError(error, 'No fue posible eliminar el usuario.'), 'error');
        },
      });
  }

  /**
   * Cierra cualquier modal abierto al presionar la tecla Escape.
   */
  @HostListener('document:keydown.escape')
  cerrarVentanas(): void {
    this.cerrarEdicion();
    this.cancelarEliminar();
  }

  // ---------- Utilidades ----------

  /**
   * Traduce la respuesta de error HTTP a un mensaje legible para el usuario.
   * @param error Error HTTP recibido del servidor.
   * @param porDefecto Mensaje de respaldo si el error no incluye detalle.
   * @returns Texto descriptivo del error.
   */
  private obtenerMensajeError(error: HttpErrorResponse, porDefecto: string): string {
    if (error.status === 0) {
      return 'No hay conexión con el servidor.';
    }
    if (error.status === 401 || error.status === 403) {
      return 'No tienes permisos para esta acción o tu sesión expiró.';
    }
    // El backend responde con texto plano explicando el motivo.
    if (typeof error.error === 'string' && error.error.trim()) {
      return error.error;
    }
    return porDefecto;
  }

  /**
   * Muestra una notificación temporal en la esquina superior derecha.
   * @param mensaje Texto a mostrar.
   * @param tipo Define el estilo visual de la notificación (`'exito'` o `'error'`).
   */
  private mostrarMensaje(mensaje: string, tipo: 'exito' | 'error'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: tipo === 'exito' ? ['snack-exito'] : ['snack-error'],
>>>>>>> Stashed changes
    });
  }

  get totalActivos(): number {
    return this.usuarios.filter(usuario =>
      usuario.estado === 'Activo'
    ).length;
  }

  get totalInactivos(): number {
    return this.usuarios.filter(usuario =>
      usuario.estado === 'Inactivo'
    ).length;
  }
}
