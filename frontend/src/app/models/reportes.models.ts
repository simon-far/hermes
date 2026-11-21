/** Conteo mensual utilizado para representar métricas agregadas por mes. */
export interface EstadisticaMensual {
  /** Nombre o etiqueta del mes. */
  mes: string;
  /** Cantidad total registrada durante el mes. */
  cantidad: number;
}
