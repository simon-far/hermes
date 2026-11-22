import { inject, Injectable, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterModel } from '../models/register.model';

/**
 * Servicio encargado del registro de nuevas cuentas de usuario en la plataforma.
 */
@Injectable({ providedIn: 'root' })
export class RegisterService {
  private readonly cliente = inject(HttpClient);
  private readonly urlbase = 'https://gpcueb.org/hermesbackend';

  /**
   * Envía los datos de registro al backend para crear una nueva cuenta.
   * @param datos Información del nuevo usuario (`username`, `password` y `email`).
   * @returns Observable con la respuesta HTTP completa y cuerpo en texto plano.
   */
  register(datos: RegisterModel) {
    // El backend responde texto plano ("Usuario registrado exitosamente"), no JSON.
    return this.cliente.post(
      `${this.urlbase}/auth/register`,
      datos,
      { observe: 'response', responseType: 'text' }
    );
  }
}
