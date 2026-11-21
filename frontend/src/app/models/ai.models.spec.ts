import { MAX_CODE_CHARS, OPERATION_LABELS } from './ai.models';

describe('ai.models', () => {
  it('define un límite de código positivo', () => {
    expect(MAX_CODE_CHARS).toBeGreaterThan(0);
  });

  it('tiene una etiqueta para cada operación', () => {
    expect(Object.keys(OPERATION_LABELS).sort()).toEqual(['ANALYZE', 'FORMAT', 'TRANSLATE']);
  });
});
