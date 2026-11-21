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


const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace";


@Component({
  selector: 'app-codeeditorcomponent',
  standalone: false,
  templateUrl: './codeeditorcomponent.html',
  styleUrl: './codeeditorcomponent.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Codeeditorcomponent implements OnDestroy {

  private readonly languageService = inject(LanguageService);

  readonly value = model('');
  readonly language = input.required<LanguageCode>();
  readonly label = input('Código');
  readonly readOnly = input(false);
  readonly maxChars = input(10_000);

  private readonly host = viewChild.required<ElementRef<HTMLDivElement>>('host');
  private kit?: CodeMirrorKit;
  private view?: EditorView;
  private destroyed = false;

  constructor() {
    afterNextRender(() => void this.createView());

    effect(() => {
      const text = this.value();
      const view = this.view;
      if (view && view.state.doc.toString() !== text) {
        view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } });
      }
    });

    effect(() => {
      const code = this.language();
      if (this.view) {
        void this.applyLanguage(code);
      }
    });

    effect(() => {
      const readOnly = this.readOnly();
      if (this.view && this.kit) {
        this.view.dispatch({ effects: this.kit.editableSlot.reconfigure(this.editable(readOnly)) });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.view?.destroy();
  }

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

  private editable(readOnly: boolean): Extension {
    const { EditorState, EditorView } = this.kit!;
    return [EditorState.readOnly.of(readOnly), EditorView.editable.of(!readOnly)];
  }

  private async applyLanguage(code: LanguageCode): Promise<void> {
    const extension = await this.languageService.loadExtension(code);
    if (this.destroyed || !this.view || !this.kit || this.language() !== code) {
      return;
    }
    this.view.dispatch({ effects: this.kit.languageSlot.reconfigure(extension) });
  }
}
