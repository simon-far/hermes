import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Estadisticas, LenguajeConteo } from '../models/estadisticas.models';
import { Solicitud } from '../models/solicitud.model';
import { LoginService } from './login.service';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

/** Colores de las gráficas por lenguaje (el último se usa para "Otros"). */
const COLORES_LENGUAJE = ['#8b70ed', '#4b9ce5', '#36bd91', '#f2bd69', '#ef6f8a', '#7c8098'];

/** Cantidad máxima de lenguajes que se muestran antes de agrupar el resto en "Otros". */
const MAX_LENGUAJES = 5;

/**
 * Datos del panel de administración y utilidades para mostrarlos
 * (fechas, gráficas, mensajes de error). Los endpoints solo responden a
 * usuarios ADMIN; cada petición envía el token de la sesión.
 */
@Injectable({ providedIn: 'root' })
export class EstadisticasService {
  private readonly cliente = inject(HttpClient);
  private readonly loginServicio = inject(LoginService);
  private readonly urlbase = 'https://gpcueb.org/hermesbackend/estadisticas';

  // ---------- Peticiones al backend ----------

  /** Totales, conteo por lenguaje, actividad mensual y últimas solicitudes. */
  obtener() {
    return this.cliente.get<Estadisticas>(this.urlbase, {
      headers: this.loginServicio.obtenerHeaders(),
    });
  }

  /** Todas las traducciones con su usuario, de la más reciente a la más antigua. */
  solicitudes() {
    return this.cliente.get<Solicitud[]>(`${this.urlbase}/solicitudes`, {
      headers: this.loginServicio.obtenerHeaders(),
    });
  }

  // ---------- Fechas y textos ----------

  /** Convierte la fecha ISO del backend en Date, o null si no hay o no es válida. */
  aFecha(fecha: string | null | undefined): Date | null {
    if (!fecha) return null;
    const d = new Date(fecha);
    return isNaN(d.getTime()) ? null : d;
  }

  /** Fecha en formato dd/mm/aaaa, o 'Sin fecha' si no hay. */
  formatearFecha(fecha: string | null | undefined): string {
    const d = this.aFecha(fecha);
    if (!d) return 'Sin fecha';
    return d.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  /** Convierte 'yyyy-MM' en la abreviatura del mes, por ejemplo '2026-11' → 'Nov'. */
  etiquetaMes(periodo: string): string {
    const mes = Number(periodo.slice(5, 7));
    return MESES[mes - 1] ?? periodo;
  }

  /** 'Java → Python' a partir de los lenguajes de la solicitud. */
  textoLenguajes(solicitud: Solicitud): string {
    const origen = solicitud.lenguajeOrigen?.trim() || 'Sin especificar';
    const destino = solicitud.lenguajeDestino?.trim() || 'Sin especificar';
    return `${origen} → ${destino}`;
  }

  /** Mensaje legible cuando falla la carga de datos del panel. */
  mensajeErrorCarga(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) return 'No hay conexión con el servidor.';
      if (error.status === 401 || error.status === 403) {
        return 'No tienes permisos para ver esta información o tu sesión expiró.';
      }
    }
    return 'No fue posible cargar la información. Intenta de nuevo más tarde.';
  }

  // ---------- Gráficas ----------

  /**
   * Ordena el conteo por lenguaje de mayor a menor, calcula porcentajes, asigna
   * colores y agrupa en "Otros" lo que pase de MAX_LENGUAJES.
   */
  lenguajesOrdenados(conteo: Record<string, number> | null | undefined): LenguajeConteo[] {
    const entradas = Object.entries(conteo ?? {}).sort((a, b) => b[1] - a[1]);
    const total = entradas.reduce((suma, [, cantidad]) => suma + cantidad, 0);
    if (total === 0) return [];

    const principales = entradas.slice(0, MAX_LENGUAJES);
    const otros = entradas.slice(MAX_LENGUAJES).reduce((suma, [, cantidad]) => suma + cantidad, 0);
    if (otros > 0) principales.push(['Otros', otros]);

    return principales.map(([lenguaje, cantidad], i) => ({
      lenguaje,
      cantidad,
      porcentaje: (cantidad / total) * 100,
      // Hay MAX_LENGUAJES + 1 colores: "Otros" siempre queda en la última posición (gris).
      color: COLORES_LENGUAJE[i],
    }));
  }

  /**
   * Valor máximo del eje de una gráfica: el mayor dato redondeado hacia arriba a
   * un múltiplo de `divisiones`, para que todas las marcas del eje sean enteras.
   */
  maximoEje(valores: number[], divisiones: number): number {
    const mayor = Math.max(0, ...valores);
    return Math.max(divisiones, Math.ceil(mayor / divisiones) * divisiones);
  }

  /** Marcas del eje de mayor a menor, por ejemplo (100, 4) → [100, 75, 50, 25, 0]. */
  marcasEje(maximo: number, divisiones: number): number[] {
    return Array.from({ length: divisiones + 1 }, (_, i) => (maximo / divisiones) * (divisiones - i));
  }
}
