import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  effect,
  inject,
  input,
  model,
  viewChild,
} from '@angular/core';
import type { Extension } from '@codemirror/state';
import type { EditorView } from '@codemirror/view';
import { LanguageCode } from '../../../models/ai.models';
import { CodeMirrorKit } from '../../../models/codemirror.models';
import { LanguageService } from '../../../services/language.service';


/** Pila de fuentes monoespaciadas aplicada al contenido del editor. */
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace";


/**
 * Envoltorio Angular para CodeMirror 6 con soporte reactivo para contenido,
 * resaltado de sintaxis dinámico y modo de solo lectura.
 */
@Component({
  selector: 'app-codeeditorcomponent',
  standalone: false,
  templateUrl: './codeeditorcomponent.html',
  styleUrl: './codeeditorcomponent.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Codeeditorcomponent implements OnDestroy {

  private readonly languageService = inject(LanguageService);

  /** Contenido textual del editor con enlace bidireccional. */
  readonly value = model('');
  /** Lenguaje de programación usado para cargar el resaltado de sintaxis. */
  readonly language = input.required<LanguageCode>();
  /** Título mostrado en la barra superior y usado como `aria-label`. */
  readonly label = input('Código');
  /** Controla si el editor bloquea la edición del contenido. */
  readonly readOnly = input(false);
  /** Límite de caracteres mostrado en el contador del encabezado. */
  readonly maxChars = input(10_000);

  /** Elemento contenedor donde se monta la instancia de CodeMirror. */
  private readonly host = viewChild.required<ElementRef<HTMLDivElement>>('host');
  /** Referencias a los módulos y compartimentos cargados dinámicamente. */
  private kit?: CodeMirrorKit;
  /** Instancia activa de `EditorView`. */
  private view?: EditorView;
  /** Bandera para abortar inicializaciones asíncronas tras destruir el componente. */
  private destroyed = false;

  constructor() {
    afterNextRender(() => void this.createView());

    // Sincroniza cambios externos en el modelo `value` hacia el documento de CodeMirror.
    effect(() => {
      const text = this.value();
      const view = this.view;
      if (view && view.state.doc.toString() !== text) {
        view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } });
      }
    });

    // Reconfigura el resaltado de sintaxis cuando cambia el lenguaje seleccionado.
    effect(() => {
      const code = this.language();
      if (this.view) {
        void this.applyLanguage(code);
      }
    });

    // Actualiza las extensiones de solo lectura cuando cambia la entrada `readOnly`.
    effect(() => {
      const readOnly = this.readOnly();
      if (this.view && this.kit) {
        this.view.dispatch({ effects: this.kit.editableSlot.reconfigure(this.editable(readOnly)) });
      }
    });
  }

  /**
   * Marca el componente como destruido y libera la instancia de CodeMirror.
   */
  ngOnDestroy(): void {
    this.destroyed = true;
    this.view?.destroy();
  }

  /**
   * Carga bajo demanda los módulos de CodeMirror (y el tema oscuro si aplica)
   * e inicializa la vista dentro del elemento host.
   */
  private async createView(): Promise<void> {
    const dark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    const [{ EditorView, basicSetup }, { EditorState, Compartment }, darkTheme] = await Promise.all([
      import('codemirror'),
      import('@codemirror/state'),
      dark ? import('@codemirror/theme-one-dark').then((m) => [m.oneDark]) : Promise.resolve([]),
    ]);
    if (this.destroyed) {
      return;
    }
    this.kit = { EditorView, basicSetup, EditorState, languageSlot: new Compartment(), editableSlot: new Compartment() };

    this.view = new EditorView({
      parent: this.host().nativeElement,
      state: EditorState.create({
        doc: this.value(),
        extensions: [
          basicSetup,
          EditorView.lineWrapping,
          EditorView.contentAttributes.of({ 'aria-label': this.label() }),
          ...darkTheme,
          EditorView.theme({
            '&': { maxHeight: '60vh', minHeight: '220px' },
            '.cm-scroller': { overflow: 'auto', fontFamily: MONO, fontSize: '0.9rem' },
          }),
          this.kit.languageSlot.of([]),
          this.kit.editableSlot.of(this.editable(this.readOnly())),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              this.value.set(update.state.doc.toString());
            }
          }),
        ],
      }),
    });
    await this.applyLanguage(this.language());
  }

  /**
   * Construye las extensiones de CodeMirror que habilitan o bloquean la edición.
   * @param readOnly Indica si el editor debe quedar en modo de solo lectura.
   * @returns Extensión compuesta para el compartimento de editabilidad.
   */
  private editable(readOnly: boolean): Extension {
    const { EditorState, EditorView } = this.kit!;
    return [EditorState.readOnly.of(readOnly), EditorView.editable.of(!readOnly)];
  }

  /**
   * Carga de forma asíncrona la extensión de lenguaje y la aplica al compartimento correspondiente.
   * Descarta el resultado si el componente fue destruido o el lenguaje cambió durante la carga.
   * @param code Código del lenguaje a activar.
   */
  private async applyLanguage(code: LanguageCode): Promise<void> {
    const extension = await this.languageService.loadExtension(code);
    if (this.destroyed || !this.view || !this.kit || this.language() !== code) {
      return;
    }
    this.view.dispatch({ effects: this.kit.languageSlot.reconfigure(extension) });
  }
}
