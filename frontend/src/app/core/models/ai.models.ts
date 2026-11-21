/** Códigos de lenguajes de programación soportados por la plataforma. */
export type LanguageCode = 'JAVA' | 'PYTHON' | 'JAVASCRIPT' | 'TYPESCRIPT' | 'CPP' | 'CSHARP';

/** Tipos de operaciones disponibles para procesar código con IA. */
export type Operation = 'TRANSLATE' | 'ANALYZE' | 'FORMAT';

/** Información básica de un modelo de IA disponible para selección. */
export interface ModelInfo {
  id: string;
  label: string;
}

/** Carga útil enviada al backend para ejecutar una operación sobre código fuente. */
export interface ProcessRequest {
  operation: Operation;
  sourceLanguage: LanguageCode;
  /** Obligatorio únicamente cuando `operation` es `'TRANSLATE'`. */
  targetLanguage?: LanguageCode;
  modelId: string;
  code: string;
}

/** Respuesta devuelta por el backend tras procesar el código con el modelo de IA. */
export interface ProcessResponse {
  modelId: string;
  operation: Operation;
  resultCode: string;
  explanation: string;
  recommendations: string[];
  /** Tiempo de respuesta del procesamiento en milisegundos. */
  latencyMs: number;
}

/** Estructura consolidada para presentar el resultado junto con su contexto original. */
export interface ResultView {
  original: string;
  sourceLanguage: LanguageCode;
  resultLanguage: LanguageCode;
  modelLabel: string;
  response: ProcessResponse;
}
<<<<<<< Updated upstream:frontend/src/app/core/models/ai.models.ts
=======

/** Límite máximo de caracteres permitidos por solicitud de procesamiento. */
export const MAX_CODE_CHARS = 10_000;

/** Etiquetas legibles en español asociadas a cada operación soportada. */
export const OPERATION_LABELS: Readonly<Record<Operation, string>> = {
  TRANSLATE: 'Traducción',
  ANALYZE: 'Análisis',
  FORMAT: 'Formateo',
};
>>>>>>> Stashed changes:frontend/src/app/models/ai.models.ts
