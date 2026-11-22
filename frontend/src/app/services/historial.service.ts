import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  TraduccionHistorial,
  TraduccionHistorialActualizacion,
} from '../models/traduccionhistorial.model';
import { LoginService } from './login.service';

/**
 * Servicio encargado de gestionar el historial de traducciones del usuario autenticado.
 * Cada petición incluye el token de sesión en las cabeceras para que el backend
 * opere exclusivamente sobre los registros del propietario del token.
 */
@Injectable({ providedIn: 'root' })
export class HistorialService {
  private readonly cliente = inject(HttpClient);
  private readonly loginServicio = inject(LoginService);
  private readonly urlbase = 'http://localhost:8080/historial';

  /**
   * Obtiene todas las traducciones guardadas por el usuario autenticado.
   * @returns Observable con el listado de traducciones del historial.
   */
  listar() {
    return this.cliente.get<TraduccionHistorial[]>(this.urlbase, {
      headers: this.loginServicio.obtenerHeaders(),
    });
  }

  /**
   * Actualiza los datos de una traducción existente en el historial.
   * @param id Identificador único de la traducción a modificar.
   * @param datos Nuevos valores de código y lenguajes.
   * @returns Observable con la respuesta en texto plano del servidor.
   */
  actualizar(id: number, datos: TraduccionHistorialActualizacion) {
    return this.cliente.put(`${this.urlbase}/actualizar/${id}`, datos, {
      headers: this.loginServicio.obtenerHeaders(),
      responseType: 'text',
    });
  }

  /**
   * Elimina una traducción específica del historial del usuario.
   * @param id Identificador único de la traducción a eliminar.
   * @returns Observable con la respuesta en texto plano del servidor.
   */
  eliminar(id: number) {
    return this.cliente.delete(`${this.urlbase}/eliminar/${id}`, {
      headers: this.loginServicio.obtenerHeaders(),
      responseType: 'text',
    });
  }
}
