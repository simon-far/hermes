import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TraduccionModel } from '../models/traduccion.model';
import { AnswertraduccionModel } from '../models/answertraduccion.model';
import { LoginService } from './login.service';

/**
 * Servicio encargado de gestionar las solicitudes de traducción de código
 * hacia los distintos modelos de IA y el envío del resultado por correo electrónico.
 */
@Injectable({ providedIn: 'root' })
export class TraduccionService {
  private readonly cliente = inject(HttpClient);
  private readonly loginServicio = inject(LoginService);
  private readonly urlbase = 'https://gpcueb.org/hermes';

  /**
   * Obtiene las cabeceras de autorización (`Authorization: Bearer <token>`)
   * correspondientes a la sesión activa.
   * @returns Instancia de `HttpHeaders` con el token del usuario.
   */
  private obtenerHeaders() {
    return this.loginServicio.obtenerHeaders();
  }

  /**
   * Traduce un fragmento de código utilizando el endpoint del modelo de IA indicado.
   * @param datos Código fuente y lenguajes de origen y destino.
   * @param endpoint Segmento de ruta del modelo (ej. `'cohere'`, `'nemotron'`, `'particle'`).
   * @returns Observable con el código traducido, sugerencias y metadatos del registro.
   */
  traducir(datos: TraduccionModel, endpoint: string) {
    return this.cliente.post<AnswertraduccionModel>(
      `${this.urlbase}/${endpoint}/traduccion`,
      datos,
      { headers: this.obtenerHeaders() }
    );
  }

  /**
   * Envía el código traducido por correo electrónico mediante `POST /correo/enviar`.
   * El backend obtiene automáticamente el destinatario a partir del usuario autenticado.
   * @param codigo Contenido del código traducido que se enviará en el cuerpo del mensaje.
   * @returns Observable con la respuesta en texto plano del servidor.
   */
  enviarCorreo(codigo: string) {
    return this.cliente.post(
      `${this.urlbase}/correo/enviar`,
      {
        asunto: 'Tu código traducido - Hermes',
        mensaje: codigo,
      },
      { headers: this.obtenerHeaders(), responseType: 'text' }
    );
  }

  /**
   * Traduce código directamente mediante el modelo Cohere.
   * @param datos Código fuente y lenguajes de origen y destino.
   * @returns Observable con la respuesta de traducción.
   */
  traducirCohere(datos: TraduccionModel) {
    return this.cliente.post<AnswertraduccionModel>(
      `${this.urlbase}/cohere/traduccion`,
      datos,
      { headers: this.obtenerHeaders() }
    );
  }

  /**
   * Traduce código directamente mediante el modelo NVIDIA Nemotron.
   * @param datos Código fuente y lenguajes de origen y destino.
   * @returns Observable con la respuesta de traducción.
   */
  traducirNemotron(datos: TraduccionModel) {
    return this.cliente.post<AnswertraduccionModel>(
      `${this.urlbase}/nemotron/traduccion`,
      datos,
      { headers: this.obtenerHeaders() }
    );
  }

  /**
   * Traduce código directamente mediante el modelo Particle Coder.
   * @param datos Código fuente y lenguajes de origen y destino.
   * @returns Observable con la respuesta de traducción.
   */
  traducirParticle(datos: TraduccionModel) {
    return this.cliente.post<AnswertraduccionModel>(
      `${this.urlbase}/particle/traduccion`,
      datos,
      { headers: this.obtenerHeaders() }
    );
  }
}
