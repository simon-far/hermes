import { MAX_CODE_CHARS, OPERATION_LABELS } from './ai.models';

/**
 * Pruebas unitarias para las constantes definidas en `ai.models`.
 * Verifican la validez del límite de caracteres y la cobertura de etiquetas por operación.
 */
describe('ai.models', () => {
  // Comprueba que el límite máximo de caracteres permitidos sea mayor que cero
  it('define un límite de código positivo', () => {
    expect(MAX_CODE_CHARS).toBeGreaterThan(0);
  });

  // Verifica que existan etiquetas para todas las operaciones soportadas
  it('tiene una etiqueta para cada operación', () => {
    expect(Object.keys(OPERATION_LABELS).sort()).toEqual(['ANALYZE', 'FORMAT', 'TRANSLATE']);
  });
});
