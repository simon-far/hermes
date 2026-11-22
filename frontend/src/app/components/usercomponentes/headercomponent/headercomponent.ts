import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterService } from '../../../services/register.service';
import { RegisterModel } from '../../../models/register.model';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../../../services/login.service';
import { LoginModel } from '../../../models/login.model';
import { Router } from '@angular/router';

// Bootstrap se carga globalmente desde index.html (bootstrap.bundle.min.js).
declare const bootstrap: any;


/**
 * Componente del encabezado principal de la plataforma.
 * Gestiona la navegación pública, el estado de la sesión y los modales
 * de inicio de sesión y registro de usuarios.
 */
@Component({
  selector: 'app-headercomponent',
  standalone: false,
  styleUrl: './headercomponent.css',
  templateUrl: './headercomponent.html',
})
export class Headercomponent {
  private readonly fb = inject(FormBuilder);
  private readonly servicio = inject(RegisterService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly loginServicio = inject(LoginService);
  private readonly router = inject(Router);

  /** Indica si hay una solicitud de registro en curso. */
  cargando = false;
  /** Indica si hay una solicitud de inicio de sesión en curso. */
  cargandoLogin = false;

  /** Formulario reactivo para autenticar usuarios existentes. */
  formularioLogin = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  /** Formulario reactivo para el registro de nuevas cuentas. */
  formulario = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });
  /**
   * Valida y envía los datos de registro al backend.
   * Muestra una notificación con el resultado y limpia el formulario si tiene éxito.
   */
  registrar(): void {
    if (this.cargando) return;

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const datos: RegisterModel = this.formulario.getRawValue();
    this.cargando = true;

    this.servicio
      .register(datos)
      .pipe(finalize(() => (this.cargando = false)))
      .subscribe({
        next: () => {
          this.mostrarMensaje('Usuario registrado correctamente.', 'exito');
          this.formulario.reset();
        },
        error: (error: HttpErrorResponse) => {
          this.mostrarMensaje(this.obtenerMensajeError(error), 'error');
        },
      });
  }

  /**
   * Autentica al usuario, cierra el modal de login y redirige al panel
   * administrativo si la cuenta posee el rol `ADMIN`.
   */
  iniciarSesion(): void {
    if (this.cargandoLogin) return;

    if (this.formularioLogin.invalid) {
      this.formularioLogin.markAllAsTouched();
      return;
    }

    const datos: LoginModel = this.formularioLogin.getRawValue();
    this.cargandoLogin = true;

    this.loginServicio
      .login(datos)
      .pipe(finalize(() => (this.cargandoLogin = false)))
      .subscribe({
        next: () => {
          this.mostrarMensaje(`Bienvenido, ${datos.username}.`, 'exito');
          this.formularioLogin.reset();
          this.cerrarModal('modalLogin');
          if (this.loginServicio.obtenerRol() === 'ADMIN') {
            this.router.navigate(['/admin/principaladmin']);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.mostrarMensaje(this.obtenerMensajeErrorLogin(error), 'error');
        },
      });
  }

  /**
   * Cierra la sesión activa y notifica al usuario.
   */
  cerrarSesion(): void {
    this.loginServicio.cerrarSesion();
    this.mostrarMensaje('Sesión cerrada.', 'exito');
  }

  /** Indica si existe una sesión iniciada actualmente. */
  get sesionIniciada(): boolean {
    return this.loginServicio.estaLogueado();
  }

  /** Nombre del usuario autenticado o `null` si no hay sesión activa. */
  get usuarioActual(): string | null {
    return this.loginServicio.obtenerUsuario();
  }

  // Accesores directos a los controles del formulario de registro
  get username() {
    return this.formulario.controls.username;
  }
  get email() {
    return this.formulario.controls.email;
  }
  get password() {
    return this.formulario.controls.password;
  }
  /**
   * Muestra una notificación temporal en la esquina superior derecha.
   * @param mensaje Texto a presentar al usuario.
   * @param tipo Define el estilo visual (`'exito'` o `'error'`).
   */
  private mostrarMensaje(mensaje: string, tipo: 'exito' | 'error'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: tipo === 'exito' ? ['snack-exito'] : ['snack-error'],
    });
  }
  private cerrarModal(id: string): void {
    const elemento = document.getElementById(id);
    if (elemento) {
      bootstrap.Modal.getOrCreateInstance(elemento).hide();
    }
  }

  private obtenerMensajeErrorLogin(error: HttpErrorResponse): string {
    switch (error.status) {
      case 0:
        return 'No hay conexión con el servidor.';
      case 401:
        return 'Usuario o contraseña incorrectos.';
      default:
        return 'No fue posible iniciar sesión. Intenta de nuevo.';
    }
  }

  private obtenerMensajeError(error: HttpErrorResponse): string {
    switch (error.status) {
      case 0:
        return 'No hay conexión con el servidor.';
      case 400:
        return 'Los datos enviados no son válidos.';
      case 403:
        return 'No tienes permiso para realizar esta acción.';
      case 409:
        return 'El usuario o el correo ya están registrados.';
      default:
        return 'No fue posible registrar el usuario. Intenta de nuevo.';
    }
  }
}

