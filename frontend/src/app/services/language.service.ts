import { Injectable } from '@angular/core';
import type { Extension } from '@codemirror/state';
import { LanguageCode } from '../models/ai.models';

/** Resaltado de sintaxis del editor de código (CodeMirror) según el lenguaje. */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  /** Carga bajo demanda el resaltado de sintaxis de CodeMirror para el lenguaje. */
  async loadExtension(code: LanguageCode): Promise<Extension> {
    switch (code) {
      case 'JAVA':
        return (await import('@codemirror/lang-java')).java();
      case 'PYTHON':
        return (await import('@codemirror/lang-python')).python();
      case 'JAVASCRIPT':
        return (await import('@codemirror/lang-javascript')).javascript();
      case 'TYPESCRIPT':
        return (await import('@codemirror/lang-javascript')).javascript({ typescript: true });
      case 'CPP':
        return (await import('@codemirror/lang-cpp')).cpp();
      case 'CSHARP': {
        const [{ StreamLanguage }, { csharp }] = await Promise.all([
          import('@codemirror/language'),
          import('@codemirror/legacy-modes/mode/clike'),
        ]);
        return StreamLanguage.define(csharp);
      }
    }
  }
}
