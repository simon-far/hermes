/**
 * Opción de una lista desplegable (<select>): el valor que se guarda y el
 * texto que ve el usuario. `T` permite restringir el valor, por ejemplo a un rol.
 */
export interface Opcion<T extends string = string> {
  valor: T;
  etiqueta: string;
}
