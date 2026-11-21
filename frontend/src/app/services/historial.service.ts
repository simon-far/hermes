import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  TraduccionHistorial,
  TraduccionHistorialActualizacion,
} from '../models/traduccionhistorial.model';
import { LoginService } from './login.service';

/**
 * Historial de traducciones del usuario con sesión iniciada.
 * Cada petición envía el token de la sesión; el backend solo devuelve y
 * modifica las traducciones del dueño del token.
 */
@Injectable({ providedIn: 'root' })
export class HistorialService {
  private readonly cliente = inject(HttpClient);
  private readonly loginServicio = inject(LoginService);
  private readonly urlbase = 'http://localhost:8080/historial';

  listar() {
    return this.cliente.get<TraduccionHistorial[]>(this.urlbase, {
      headers: this.loginServicio.obtenerHeaders(),
    });
  }

  actualizar(id: number, datos: TraduccionHistorialActualizacion) {
    return this.cliente.put(`${this.urlbase}/actualizar/${id}`, datos, {
      headers: this.loginServicio.obtenerHeaders(),
      responseType: 'text',
    });
  }

  eliminar(id: number) {
    return this.cliente.delete(`${this.urlbase}/eliminar/${id}`, {
      headers: this.loginServicio.obtenerHeaders(),
      responseType: 'text',
    });
  }
}
