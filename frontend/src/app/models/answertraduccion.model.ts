/** Respuesta devuelta por el backend tras completar una traducción de código. */
export interface AnswertraduccionModel {
  /** Identificador único del registro guardado en el historial. */
  id: number;
  /** Código fuente original enviado por el usuario. */
  codigoOriginal: string;
  /** Código resultante generado por el modelo de IA. */
  codigoTraducido: string;
  /** Código del lenguaje de programación de origen. */
  lenguajeOrigen: string;
  /** Código del lenguaje de programación de destino. */
  lenguajeDestino: string;
  /** Lista de sugerencias o mejoras recomendadas por la IA. */
  mejoras: string[];
  /** Identificador o nombre del modelo de IA utilizado. */
  modelo: string;
  /** Fecha y hora en que se registró la traducción. */
  fecha: string;
}
