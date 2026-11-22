import { Opcion } from './opcion.model';

/** Traducción guardada en el historial del usuario (respuesta de `GET /historial`). */
export interface TraduccionHistorial {
  /** Identificador único del registro en el historial. */
  id: number;
  /** Código fuente original enviado para traducir. */
  codigoOriginal: string;
  /** Código resultante generado por el modelo de IA. */
  codigoTraducido: string;
  /** Código del lenguaje de programación de origen. */
  lenguajeOrigen: string;
  /** Código del lenguaje de programación de destino. */
  lenguajeDestino: string;
  /** Nombre o identificador del modelo de IA utilizado, o null si no se registró. */
  modelo: string | null;
  /** Fecha ISO enviada por el backend, ej. `"2026-11-20T15:41:03"`. */
  fecha: string | null;
}

/** Campos editables al actualizar una traducción existente en el historial. */
export interface TraduccionHistorialActualizacion {
  /** Código fuente original actualizado. */
  codigoOriginal: string;
  /** Código traducido actualizado. */
  codigoTraducido: string;
  /** Código del lenguaje de origen seleccionado. */
  lenguajeOrigen: string;
  /** Código del lenguaje de destino seleccionado. */
  lenguajeDestino: string;
}

/** Lenguajes disponibles en el traductor (mismos códigos que guarda el backend). */
export const LENGUAJES_HISTORIAL: Opcion[] = [
  { valor: 'JAVASCRIPT', etiqueta: 'JavaScript' },
  { valor: 'TYPESCRIPT', etiqueta: 'TypeScript' },
  { valor: 'JAVA', etiqueta: 'Java' },
  { valor: 'PYTHON', etiqueta: 'Python' },
  { valor: 'CPP', etiqueta: 'C++' },
  { valor: 'CSHARP', etiqueta: 'C#' },
];
