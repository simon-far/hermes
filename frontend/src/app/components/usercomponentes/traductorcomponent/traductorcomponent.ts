
import { Component, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { LanguageCode } from '../../../models/ai/ai.models';
import { TraduccionModel } from '../../../models/traduccion.model';
import { TraduccionService } from '../../../services/traduccion.service';
import { LoginService } from '../../../services/login.service';

// Bootstrap se carga globalmente desde index.html (bootstrap.bundle.min.js).
declare const bootstrap: any;

/**
 * Componente principal del espacio de trabajo de traducción de código.
 * Permite seleccionar lenguajes y modelos de IA, ejecutar traducciones,
 * consultar sugerencias de mejora y enviar el resultado por correo electrónico.
 */
@Component({
  selector: 'app-traductorcomponent',
  standalone: false,
  styleUrl: './traductorcomponent.css',
  templateUrl: './traductorcomponent.html',
})
export class Traductorcomponent {
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
  private readonly servicio = inject(TraduccionService);
  private readonly loginServicio = inject(LoginService);
  private readonly snackBar = inject(MatSnackBar);

  /** Lenguaje del código de entrada. */
  lenguajeOrigen: LanguageCode = 'JAVASCRIPT';

  /** Lenguaje al que se traducirá el código. */
  lenguajeDestino: LanguageCode = 'PYTHON';

  /** Código fuente ingresado por el usuario. */
  codigoOrigen = '';

  /** Código resultante devuelto por el servicio de traducción. */
  codigoDestino = '';

  /** Lista de recomendaciones o mejoras sugeridas por la IA. */
  mejoras: string[] = [];

  /** Indica si hay una solicitud de traducción en curso. */
  cargando = false;

<<<<<<< Updated upstream
=======
  /** Catálogo de modelos de IA disponibles para ejecutar la traducción. */
  readonly modelos: ModeloIA[] = [
    { endpoint: 'cohere', nombre: 'Cohere North Mini Code', descripcion: 'Rápido y ligero' },
    { endpoint: 'nemotron', nombre: 'NVIDIA Nemotron 3 Ultra', descripcion: 'Mayor capacidad de razonamiento' },
    { endpoint: 'particle', nombre: 'Particle Coder', descripcion: 'Especializado en código' },
  ];

  /** Modelo de IA activo actualmente. */
  modeloSeleccionado: ModeloIA = this.modelos[0];

  /** Controla la visibilidad del menú desplegable de modelos. */
  menuModelosAbierto = false;

  /**
   * Alterna la apertura del selector de modelos evitando que el clic
   * se propague al listener global del documento.
   * @param event Evento de clic del botón disparador.
   */
  seleccionarModelo(event: MouseEvent): void {
    event.stopPropagation();
    this.menuModelosAbierto = !this.menuModelosAbierto;
  }

  /**
   * Asigna el modelo de IA elegido y cierra el menú desplegable.
   * @param modelo Modelo seleccionado por el usuario.
   */
  elegirModelo(modelo: ModeloIA): void {
    this.modeloSeleccionado = modelo;
    this.menuModelosAbierto = false;
  }

  /**
   * Cierra el menú de modelos al hacer clic fuera de él o al presionar Escape.
   */
  @HostListener('document:click')
  @HostListener('document:keydown.escape')
  cerrarMenuModelos(): void {
    this.menuModelosAbierto = false;
  }

  /**
   * Valida la entrada y la sesión activa, envía el código al modelo de IA
   * seleccionado y actualiza el editor de destino junto con las sugerencias.
   */
>>>>>>> Stashed changes
  traducir(): void {
    if (this.cargando) return;

    if (!this.codigoOrigen.trim()) {
      this.mostrarMensaje('Escribe el código que quieres traducir.', 'error');
      return;
    }

    if (!this.loginServicio.estaLogueado()) {
      this.mostrarMensaje('Inicia sesión para traducir.', 'error');
      this.abrirModalLogin();
      return;
    }

    const datos: TraduccionModel = {
      codigo: this.codigoOrigen,
      lenguajeOrigen: this.lenguajeOrigen,
      lenguajeDestino: this.lenguajeDestino,
    };
    this.cargando = true;

    this.servicio
      .traducir(datos)
      .pipe(finalize(() => (this.cargando = false)))
      .subscribe({
        next: (respuesta) => {
          this.codigoDestino = respuesta.codigoTraducido;
          this.mejoras = respuesta.mejoras ?? [];
          this.mostrarMensaje('Traducción lista.', 'exito');
        },
        error: (error: HttpErrorResponse) => {
          this.mostrarMensaje(this.obtenerMensajeError(error), 'error');
        },
      });
  }

  /**
   * Intercambia los lenguajes de origen y destino junto con el contenido
   * de ambos editores, y limpia las sugerencias previas.
   */
  intercambiarLenguajes(): void {
    const lenguajeTemporal = this.lenguajeOrigen;

    this.lenguajeOrigen = this.lenguajeDestino;
    this.lenguajeDestino = lenguajeTemporal;

    const codigoTemporal = this.codigoOrigen;

    this.codigoOrigen = this.codigoDestino;
    this.codigoDestino = codigoTemporal;
    this.mejoras = [];
  }

  /**
   * Vacía ambos editores y las sugerencias de la IA.
   */
  limpiar(): void {
    this.codigoOrigen = '';
    this.codigoDestino = '';
    this.mejoras = [];
  }

  /**
   * Copia el código traducido al portapapeles del sistema si existe contenido.
   */
  copiarResultado(): void {
    if (!this.codigoDestino.trim()) {
      return;
    }

    navigator.clipboard.writeText(this.codigoDestino).catch(error => {
      console.error('No se pudo copiar el código:', error);
    });
  }

  /**
   * Muestra el modal global de inicio de sesión definido en el encabezado.
   */
  private abrirModalLogin(): void {
    const elemento = document.getElementById('modalLogin');
    if (elemento) {
      bootstrap.Modal.getOrCreateInstance(elemento).show();
    }
  }

  /**
   * Muestra una notificación temporal en la esquina superior derecha.
   * @param mensaje Texto a presentar al usuario.
   * @param tipo Define el estilo visual (`'exito'` o `'error'`).
   */
  private mostrarMensaje(mensaje: string, tipo: 'exito' | 'error'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: tipo === 'exito' ? ['snack-exito'] : ['snack-error'],
    });
  }

  /**
   * Traduce los errores HTTP de la traducción a mensajes legibles y gestiona
   * el cierre de sesión automático ante respuestas 401/403.
   * @param error Error HTTP recibido del servidor.
   * @returns Mensaje descriptivo para mostrar al usuario.
   */
  private obtenerMensajeError(error: HttpErrorResponse): string {
    switch (error.status) {
      case 0:
        return 'No hay conexión con el servidor.';
      case 401:
      case 403:
        // El token no es válido o expiró: se cierra la sesión local para que vuelva a entrar.
        this.loginServicio.cerrarSesion();
        this.abrirModalLogin();
        return 'Tu sesión expiró. Inicia sesión de nuevo.';
      case 502:
        return 'El servicio de IA no respondió correctamente. Intenta de nuevo.';
      case 503:
        return 'El modelo de IA está saturado. Intenta de nuevo en unos minutos.';
      default:
        return 'No fue posible traducir el código. Intenta de nuevo.';
    }
  }
<<<<<<< Updated upstream
=======

  /**
   * Envía el código traducido al correo electrónico asociado a la cuenta del usuario.
   */
  enviarCorreo(): void {
    if (!this.codigoDestino.trim()) {
      this.mostrarMensaje('Primero traduce un código para poder enviarlo.', 'error');
      return;
    }

    if (!this.loginServicio.estaLogueado()) {
      this.mostrarMensaje('Inicia sesión para enviar el correo.', 'error');
      this.abrirModalLogin();
      return;
    }

    this.servicio.enviarCorreo(this.codigoDestino).subscribe({
      next: () => {
        this.mostrarMensaje('Correo enviado exitosamente.', 'exito');
      },
      error: (error: HttpErrorResponse) => {
        this.mostrarMensaje(this.obtenerMensajeErrorCorreo(error), 'error');
      }
    });
  }

  /**
   * Traduce los errores HTTP del envío de correo (no reutiliza los mensajes específicos de IA).
   * @param error Error HTTP recibido del servidor.
   * @returns Mensaje descriptivo para mostrar al usuario.
   */
  private obtenerMensajeErrorCorreo(error: HttpErrorResponse): string {
    if (error.status === 0 || error.status === 401 || error.status === 403) {
      return this.obtenerMensajeError(error);
    }
    // El backend responde con texto plano explicando el motivo (ej. "Error al enviar el correo: ...").
    if (typeof error.error === 'string' && error.error.trim()) {
      return error.error;
    }
    return 'No fue posible enviar el correo. Intenta de nuevo.';
  }
>>>>>>> Stashed changes
}
