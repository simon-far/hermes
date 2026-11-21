import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../../../services/login.service';

/**
 * Componente de la cabecera del panel de administración.
 * Gestiona la navegación principal, el menú desplegable del perfil y el cierre de sesión.
 */
@Component({
  selector: 'app-headeradmincomponent',
  standalone: false,
  styleUrl: './headeradmincomponent.css',
  templateUrl: './headeradmincomponent.html',
})
export class Headeradmincomponent {
  private readonly loginServicio = inject(LoginService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  /** Controla la visibilidad del menú desplegable del perfil. */
  menuPerfilAbierto = false;

  /**
   * Obtiene el nombre del usuario autenticado actualmente.
   * @returns Nombre del usuario en sesión o Administrador por defecto.
   */
  get usuarioActual(): string {
    return this.loginServicio.obtenerUsuario() ?? 'Administrador';
  }

  /**
   * Alterna el estado de apertura del menú desplegable del perfil.
   */
  alternarMenuPerfil(): void {
    this.menuPerfilAbierto = !this.menuPerfilAbierto;
  }

  /**
   * Cierra la sesión actual, muestra una notificación y redirige a la vista del traductor.
   */
  cerrarSesion(): void {
    this.menuPerfilAbierto = false;
    this.loginServicio.cerrarSesion();
    this.snackBar.open('Sesión cerrada.', 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snack-exito'],
    });
    this.router.navigate(['/usuario/traductor']);
  }
}
