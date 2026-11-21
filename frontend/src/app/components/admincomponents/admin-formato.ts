import { HttpErrorResponse } from '@angular/common/http';
import { Solicitud } from '../../models/admin/solicitud.model';

/** Funciones de formato compartidas por los componentes del panel de administración. */

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

/** Colores de las gráficas por lenguaje (el último se usa para "Otros"). */
const COLORES_LENGUAJE = ['#8b70ed', '#4b9ce5', '#36bd91', '#f2bd69', '#ef6f8a', '#7c8098'];

/** Cantidad máxima de lenguajes que se muestran antes de agrupar el resto en "Otros". */
const MAX_LENGUAJES = 5;

export interface LenguajeConteo {
  lenguaje: string;
  cantidad: number;
  porcentaje: number;
  color: string;
}

/** Convierte 'yyyy-MM' en la abreviatura del mes, por ejemplo '2026-11' → 'Nov'. */
export function etiquetaMes(periodo: string): string {
  const mes = Number(periodo.slice(5, 7));
  return MESES[mes - 1] ?? periodo;
}

function aFecha(fecha: string | null | undefined): Date | null {
  if (!fecha) return null;
  const d = new Date(fecha);
  return isNaN(d.getTime()) ? null : d;
}

/** Fecha en formato dd/mm/aaaa, o 'Sin fecha' si no hay. */
export function formatearFecha(fecha: string | null | undefined): string {
  const d = aFecha(fecha);
  if (!d) return 'Sin fecha';
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/** Indica si la fecha cae en el mes actual. */
export function esDelMesActual(fecha: string | null | undefined, ahora = new Date()): boolean {
  const d = aFecha(fecha);
  return !!d && d.getFullYear() === ahora.getFullYear() && d.getMonth() === ahora.getMonth();
}

/** Texto relativo como 'Hace 10 minutos' o 'Hace 2 días'. */
export function tiempoRelativo(fecha: string | null | undefined, ahora = new Date()): string {
  const d = aFecha(fecha);
  if (!d) return 'Sin fecha';

  const minutos = Math.floor((ahora.getTime() - d.getTime()) / 60000);
  if (minutos < 1) return 'Hace un momento';
  if (minutos < 60) return `Hace ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;

  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `Hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;

  const dias = Math.floor(horas / 24);
  if (dias < 30) return `Hace ${dias} ${dias === 1 ? 'día' : 'días'}`;

  return formatearFecha(fecha);
}

/** 'Java → Python' a partir de los lenguajes de la solicitud. */
export function textoLenguajes(solicitud: Solicitud): string {
  const origen = solicitud.lenguajeOrigen?.trim() || 'Sin especificar';
  const destino = solicitud.lenguajeDestino?.trim() || 'Sin especificar';
  return `${origen} → ${destino}`;
}

/**
 * Ordena el conteo por lenguaje de mayor a menor, calcula porcentajes, asigna
 * colores y agrupa en "Otros" lo que pase de {@link MAX_LENGUAJES}.
 */
export function lenguajesOrdenados(conteo: Record<string, number> | null | undefined): LenguajeConteo[] {
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
export function maximoEje(valores: number[], divisiones: number): number {
  const mayor = Math.max(0, ...valores);
  return Math.max(divisiones, Math.ceil(mayor / divisiones) * divisiones);
}

/** Marcas del eje de mayor a menor, por ejemplo (100, 4) → [100, 75, 50, 25, 0]. */
export function marcasEje(maximo: number, divisiones: number): number[] {
  return Array.from({ length: divisiones + 1 }, (_, i) => (maximo / divisiones) * (divisiones - i));
}

/** Mensaje legible cuando falla la carga de datos del panel. */
export function mensajeErrorCarga(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) return 'No hay conexión con el servidor.';
    if (error.status === 401 || error.status === 403) {
      return 'No tienes permisos para ver esta información o tu sesión expiró.';
    }
  }
  return 'No fue posible cargar la información. Intenta de nuevo más tarde.';
}
