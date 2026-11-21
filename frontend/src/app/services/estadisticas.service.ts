import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Estadisticas } from '../models/admin/estadisticas.models';
import { Solicitud } from '../models/admin/solicitud.model';

/**
 * Datos del panel de administración. Solo responde a usuarios ADMIN;
 * el token lo agrega el authInterceptor.
 */
@Injectable({ providedIn: 'root' })
export class EstadisticasService {
  private readonly cliente = inject(HttpClient);
  private readonly urlbase = `${environment.apiUrl}/estadisticas`;

  /** Totales, conteo por lenguaje, actividad mensual y últimas solicitudes. */
  obtener() {
    return this.cliente.get<Estadisticas>(this.urlbase);
  }

  /** Todas las traducciones con su usuario, de la más reciente a la más antigua. */
  solicitudes() {
    return this.cliente.get<Solicitud[]>(`${this.urlbase}/solicitudes`);
  }
}
