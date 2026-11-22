import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, UrlTree } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs';
import { LoginModel } from '../models/login.model';
import { AnswerloginModel } from '../models/answerlogin.model';

/** Clave de `sessionStorage` para el token JWT de la sesión activa. */
const CLAVE_TOKEN = 'hermes.token';
/** Clave de `sessionStorage` para el rol del usuario autenticado. */
const CLAVE_ROL = 'hermes.rol';
/** Clave de `sessionStorage` para el nombre de usuario autenticado. */
const CLAVE_USUARIO = 'hermes.usuario';

/**
 * Servicio de autenticación y gestión de sesión del usuario.
 * Administra el inicio y cierre de sesión, la persistencia en `sessionStorage`,
 * las cabeceras de autorización y la protección de rutas administrativas.
 */
@Injectable({ providedIn: 'root' })
export class LoginService {
  private readonly cliente = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly urlbase = 'https://gpcueb.org/hermes';

  /**
   * Construye las cabeceras HTTP con el encabezado `Authorization: Bearer <token>`
   * para peticiones protegidas. Si no hay sesión activa, devuelve cabeceras vacías.
   * @returns Instancia de `HttpHeaders` lista para adjuntar en solicitudes HTTP.
   */
  obtenerHeaders(): HttpHeaders {
    const token = this.obtenerToken();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  /**
   * Valida el acceso a las rutas `/admin` (usado en `canActivate` del enrutador).
   * Permite el ingreso solo si existe sesión activa con rol `'ADMIN'`; en caso
   * contrario muestra una notificación y redirige al traductor.
   * @returns `true` si el usuario está autorizado o un `UrlTree` hacia `/usuario/traductor`.
   */
  validarAccesoAdmin(): boolean | UrlTree {
    if (this.estaLogueado() && this.obtenerRol() === 'ADMIN') {
      return true;
    }
    this.snackBar.open('No tienes permiso para acceder al panel de administración.', 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snack-error'],
    });
    return this.router.parseUrl('/usuario/traductor');
  }

  /**
   * Envía las credenciales al backend para autenticar al usuario y guarda
   * la sesión localmente si la respuesta es exitosa.
   * @param datos Credenciales de inicio de sesión (`username` y `password`).
   * @returns Observable con el token y rol devueltos por el servidor.
   */
  login(datos: LoginModel) {
    return this.cliente
      .post<AnswerloginModel>(`${this.urlbase}/auth/login`, datos)
      .pipe(tap((respuesta) => this.guardarSesion(respuesta, datos.username)));
  }

  /**
   * Elimina el token, el rol y el usuario almacenados en `sessionStorage`.
   */
  cerrarSesion(): void {
    sessionStorage.removeItem(CLAVE_TOKEN);
    sessionStorage.removeItem(CLAVE_ROL);
    sessionStorage.removeItem(CLAVE_USUARIO);
  }

  /**
   * Recupera el token JWT almacenado en la sesión actual.
   * @returns Token de autorización o `null` si no existe.
   */
  obtenerToken(): string | null {
    return sessionStorage.getItem(CLAVE_TOKEN);
  }

  /**
   * Recupera el rol del usuario autenticado.
   * @returns Rol asignado (ej. `'USER'` o `'ADMIN'`) o `null` si no existe.
   */
  obtenerRol(): string | null {
    return sessionStorage.getItem(CLAVE_ROL);
  }

  /**
   * Recupera el nombre de usuario de la sesión activa.
   * @returns Nombre de usuario o `null` si no hay sesión.
   */
  obtenerUsuario(): string | null {
    return sessionStorage.getItem(CLAVE_USUARIO);
  }

  /**
   * Indica si existe una sesión activa basada en la presencia del token.
   * @returns `true` si hay un token almacenado; `false` en caso contrario.
   */
  estaLogueado(): boolean {
    return this.obtenerToken() !== null;
  }

  /**
   * Persiste en `sessionStorage` los datos devueltos tras un inicio de sesión exitoso.
   * @param respuesta Respuesta del servidor con token y rol.
   * @param username Nombre de usuario con el que se inició sesión.
   */
  private guardarSesion(respuesta: AnswerloginModel, username: string): void {
    sessionStorage.setItem(CLAVE_TOKEN, respuesta.token);
    sessionStorage.setItem(CLAVE_ROL, respuesta.role ?? '');
    sessionStorage.setItem(CLAVE_USUARIO, username);
  }
}
