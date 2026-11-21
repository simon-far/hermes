/** Tarjeta de métrica resumida mostrada en el panel principal. */
export interface Estadistica {
  /** Nombre o etiqueta principal del indicador. */
  titulo: string;
  /** Valor numérico actual de la métrica. */
  valor: number;
  /** Texto breve que contextualiza el indicador. */
  descripcion: string;
  /** Clase CSS del ícono asociado a la tarjeta. */
  icono: string;
  /** Cambio porcentual o tendencia opcional respecto al periodo anterior. */
  variacion?: string;
  /** Color o clase visual utilizada para destacar la tarjeta. */
  color: string;
}

/** Registro individual de un evento reciente para la lista de actividad. */
export interface Actividad {
  /** Encabezado corto del evento registrado. */
  titulo: string;
  /** Detalle resumido de la acción realizada. */
  descripcion: string;
  /** Fecha o marca temporal en que ocurrió el evento. */
  fecha: string;
  /** Clase CSS del ícono representativo del evento. */
  icono: string;
  /** Categoría del evento usada para aplicar estilos o filtros. */
  tipo: string;
}

/** Punto de datos por periodo utilizado para renderizar las gráficas del panel. */
export interface DatoGrafica {
  /** Etiqueta del periodo representado (ej. mes o rango de fechas). */
  periodo: string;
  /** Cantidad de usuarios contabilizados en el periodo. */
  usuarios: number;
  /** Cantidad de solicitudes procesadas en el periodo. */
  solicitudes: number;
}
