import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Estadisticas } from '../models/estadisticas.model';

@Injectable({
  providedIn: 'root',
})
export class EstadisticasService {
  private readonly cliente = inject(HttpClient);
  private readonly urlbase = 'http://localhost:8080';

  obtenerEstadisticas() {
    return this.cliente.get<Estadisticas>(`${this.urlbase}/estadisticas`);
  }
}
