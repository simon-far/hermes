import type { Compartment } from '@codemirror/state';

/** Piezas de CodeMirror que el editor carga de forma diferida. */
export interface CodeMirrorKit {
  /** Constructor de la vista principal de CodeMirror. */
  EditorView: typeof import('codemirror').EditorView;
  /** Conjunto base de extensiones (numeración de líneas, historial, búsqueda.). */
  basicSetup: typeof import('codemirror').basicSetup;
  /** Clase encargada de crear y gestionar el estado inmutable del editor. */
  EditorState: typeof import('@codemirror/state').EditorState;
  /** Compartimento dinámico para intercambiar la extensión de resaltado de sintaxis. */
  languageSlot: Compartment;
  /** Compartimento dinámico para alternar entre modo editable y solo lectura. */
  editableSlot: Compartment;
}
