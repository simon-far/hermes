/**
 * Opción de una lista desplegable (<select>): el valor que se guarda y el
 * texto que ve el usuario. `T` permite restringir el valor, por ejemplo a un rol.
 */
export interface Opcion<T extends string = string> {
  /** Valor interno enviado o evaluado al seleccionar la opción. */
  valor: T;
  /** Texto legible mostrado al usuario en la interfaz. */
  etiqueta: string;
}
