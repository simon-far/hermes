import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, UrlTree } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs';
import { LoginModel } from '../models/login.model';
import { AnswerloginModel } from '../models/answerlogin.model';

const CLAVE_TOKEN = 'hermes.token';
const CLAVE_ROL = 'hermes.rol';
const CLAVE_USUARIO = 'hermes.usuario';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private readonly cliente = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly urlbase = 'http://localhost:8080';

  /**
   * Headers para las peticiones protegidas: "Authorization: Bearer <token>" con
   * el token guardado al iniciar sesión. Sin sesión, no agrega nada.
   * Lo usan todos los servicios que llaman a endpoints que requieren autenticación.
   */
  obtenerHeaders(): HttpHeaders {
    const token = this.obtenerToken();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  /**
   * Protege las rutas /admin (se usa en canActivate de app-routing-module):
   * deja entrar solo con sesión iniciada y rol ADMIN; si no, avisa y redirige
   * al traductor.
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

  login(datos: LoginModel) {
    return this.cliente
      .post<AnswerloginModel>(`${this.urlbase}/auth/login`, datos)
      .pipe(tap((respuesta) => this.guardarSesion(respuesta, datos.username)));
  }

  cerrarSesion(): void {
    sessionStorage.removeItem(CLAVE_TOKEN);
    sessionStorage.removeItem(CLAVE_ROL);
    sessionStorage.removeItem(CLAVE_USUARIO);
  }

  obtenerToken(): string | null {
    return sessionStorage.getItem(CLAVE_TOKEN);
  }

  obtenerRol(): string | null {
    return sessionStorage.getItem(CLAVE_ROL);
  }

  obtenerUsuario(): string | null {
    return sessionStorage.getItem(CLAVE_USUARIO);
  }

  estaLogueado(): boolean {
    return this.obtenerToken() !== null;
  }

  private guardarSesion(respuesta: AnswerloginModel, username: string): void {
    sessionStorage.setItem(CLAVE_TOKEN, respuesta.token);
    sessionStorage.setItem(CLAVE_ROL, respuesta.role ?? '');
    sessionStorage.setItem(CLAVE_USUARIO, username);
  }
}
