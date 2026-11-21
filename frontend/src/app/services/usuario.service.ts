import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User, UsuarioActualizacion } from '../models/usuarios.model';
import { LoginService } from './login.service';

/**
 * Servicio para la gestión de usuarios desde el panel de administración.
 * Todas las operaciones requieren sesión activa con rol `ADMIN`.
 */
@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly cliente = inject(HttpClient);
  private readonly loginServicio = inject(LoginService);
  private readonly urlbase = 'http://localhost:8080';

  /**
   * Obtiene el listado completo de usuarios registrados en la plataforma.
   * @returns Observable con el arreglo de usuarios.
   */
  getAll() {
    return this.cliente.get<User[]>(`${this.urlbase}/user/getall`, {
      headers: this.loginServicio.obtenerHeaders(),
    });
  }

  /**
   * Actualiza los datos de un usuario existente.
   * Si `password` va vacío, el backend conserva la contraseña actual.
   * @param id Identificador único del usuario a actualizar.
   * @param datos Nuevos datos de la cuenta (`username`, `email`, `rol` y opcionalmente `password`).
   * @returns Observable con la respuesta en texto plano del servidor.
   */
  actualizar(id: number, datos: UsuarioActualizacion) {
    return this.cliente.post(`${this.urlbase}/user/updateuser/${id}`, datos, {
      headers: this.loginServicio.obtenerHeaders(),
      responseType: 'text',
    });
  }

  /**
   * Elimina una cuenta de usuario junto con su historial de traducciones asociado.
   * @param id Identificador único del usuario a eliminar.
   * @returns Observable con la respuesta en texto plano del servidor.
   */
  eliminar(id: number) {
    return this.cliente.delete(`${this.urlbase}/user/deletebyid/${id}`, {
      headers: this.loginServicio.obtenerHeaders(),
      responseType: 'text',
    });
  }
}
