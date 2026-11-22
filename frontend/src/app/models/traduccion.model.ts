/** Carga útil enviada al backend para solicitar la traducción de un fragmento de código. */
export interface TraduccionModel {
  /** Código fuente original que se desea traducir. */
  codigo: string;
  /** Código del lenguaje de programación de origen. */
  lenguajeOrigen: string;
  /** Código del lenguaje de programación de destino. */
  lenguajeDestino: string;
}
