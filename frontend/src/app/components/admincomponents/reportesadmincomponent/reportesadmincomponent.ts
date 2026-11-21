import { Component } from '@angular/core';
interface ReporteUsuario {
  id: number;
  nombre: string;
  correo: string;
  fechaRegistro: string;
  estado: 'Activo' | 'Inactivo';
}

<<<<<<< Updated upstream
interface ReporteSolicitud {
  id: number;
  usuario: string;
  tipo: string;
  fecha: string;
  estado: 'Pendiente' | 'En proceso' | 'Atendida';
}

interface EstadisticaMensual {
  mes: string;
  cantidad: number;
}
=======
/** Divisiones del eje Y del gráfico mensual. */
const DIVISIONES_EJE = 3;

/**
 * Componente de reportes y estadísticas del panel de administración.
 * Consulta usuarios, solicitudes y métricas generales para renderizar
 * los gráficos de distribución y habilitar la exportación a CSV.
 */
>>>>>>> Stashed changes
@Component({
  selector: 'app-reportesadmincomponent',
  standalone: false,
  styleUrl: './reportesadmincomponent.css',
  templateUrl: './reportesadmincomponent.html',
})
export class Reportesadmincomponent { // Datos ficticios de usuarios
  usuarios: ReporteUsuario[] = [
    { id: 1, nombre: 'Laura Martínez', correo: 'laura@email.com', fechaRegistro: '2026-01-12', estado: 'Activo' },
    { id: 2, nombre: 'Carlos Rodríguez', correo: 'carlos@email.com', fechaRegistro: '2026-02-08', estado: 'Activo' },
    { id: 3, nombre: 'Mariana López', correo: 'mariana@email.com', fechaRegistro: '2026-03-15', estado: 'Inactivo' },
    { id: 4, nombre: 'Andrés Gómez', correo: 'andres@email.com', fechaRegistro: '2026-04-20', estado: 'Activo' },
    { id: 5, nombre: 'Sofía Torres', correo: 'sofia@email.com', fechaRegistro: '2026-05-03', estado: 'Activo' }
  ];

<<<<<<< Updated upstream
  // Datos ficticios de solicitudes
  solicitudes: ReporteSolicitud[] = [
    { id: 1001, usuario: 'Laura Martínez', tipo: 'Traducción de código', fecha: '2026-10-01', estado: 'Atendida' },
    { id: 1002, usuario: 'Carlos Rodríguez', tipo: 'Mejora de código', fecha: '2026-10-04', estado: 'Pendiente' },
    { id: 1003, usuario: 'Mariana López', tipo: 'Traducción de código', fecha: '2026-10-07', estado: 'En proceso' },
    { id: 1004, usuario: 'Andrés Gómez', tipo: 'Mejora de código', fecha: '2026-10-12', estado: 'Atendida' },
    { id: 1005, usuario: 'Sofía Torres', tipo: 'Traducción de código', fecha: '2026-10-18', estado: 'Pendiente' },
    { id: 1006, usuario: 'Laura Martínez', tipo: 'Mejora de código', fecha: '2026-10-22', estado: 'Atendida' },
    { id: 1007, usuario: 'Carlos Rodríguez', tipo: 'Traducción de código', fecha: '2026-10-25', estado: 'En proceso' },
    { id: 1008, usuario: 'Andrés Gómez', tipo: 'Mejora de código', fecha: '2026-10-28', estado: 'Atendida' }
  ];

  // Estadísticas mensuales ficticias
  estadisticasMensuales: EstadisticaMensual[] = [
    { mes: 'Jun', cantidad: 18 },
    { mes: 'Jul', cantidad: 25 },
    { mes: 'Ago', cantidad: 32 },
    { mes: 'Sep', cantidad: 28 },
    { mes: 'Oct', cantidad: 42 },
    { mes: 'Nov', cantidad: 35 }
  ];

  // Resumen de usuarios
  get totalUsuarios(): number {
    return this.usuarios.length;
  }

  get usuariosActivos(): number {
    return this.usuarios.filter(usuario => usuario.estado === 'Activo').length;
  }

  // Resumen de solicitudes
  get totalSolicitudes(): number {
    return this.solicitudes.length;
  }

  get solicitudesPendientes(): number {
    return this.solicitudes.filter(s => s.estado === 'Pendiente').length;
  }

  get solicitudesEnProceso(): number {
    return this.solicitudes.filter(s => s.estado === 'En proceso').length;
  }

  get solicitudesAtendidas(): number {
    return this.solicitudes.filter(s => s.estado === 'Atendida').length;
  }

  // Porcentajes para el gráfico circular
  get porcentajePendientes(): number {
    return this.totalSolicitudes
      ? (this.solicitudesPendientes / this.totalSolicitudes) * 100
      : 0;
  }

  get porcentajeEnProceso(): number {
    return this.totalSolicitudes
      ? (this.solicitudesEnProceso / this.totalSolicitudes) * 100
      : 0;
  }

  get porcentajeAtendidas(): number {
    return this.totalSolicitudes
      ? (this.solicitudesAtendidas / this.totalSolicitudes) * 100
      : 0;
  }

  // Altura de cada barra del gráfico mensual
=======
  /** Listado completo de usuarios registrados. */
  readonly usuarios = signal<User[]>([]);

  /** Listado completo de solicitudes de traducción. */
  readonly solicitudes = signal<Solicitud[]>([]);

  /** Resumen estadístico general devuelto por el backend. */
  private readonly estadisticas = signal<Estadisticas | null>(null);

  /** Indica si la carga inicial de datos sigue en curso. */
  readonly cargando = signal(true);

  /** Mensaje de error mostrado si falla alguna consulta. */
  readonly error = signal<string | null>(null);

  // Resumen
  /** Total de usuarios registrados. */
  readonly totalUsuarios = computed(() => this.usuarios().length);

  /** Total de solicitudes registradas. */
  readonly totalSolicitudes = computed(() => this.solicitudes().length);

  /** Cantidad de solicitudes correspondientes al último mes registrado. */
  readonly solicitudesMesActual = computed(
    () => this.estadisticas()?.actividadMensual.at(-1)?.traducciones ?? 0
  );

  /** Cantidad de lenguajes de destino distintos utilizados. */
  readonly totalLenguajes = computed(
    () => Object.keys(this.estadisticas()?.traduccionesPorLenguaje ?? {}).length
  );

  // Gráfico circular por lenguaje de destino
  /** Distribución de solicitudes por lenguaje ordenadas de mayor a menor. */
  readonly lenguajes = computed(() =>
    this.estadisticasService.lenguajesOrdenados(this.estadisticas()?.traduccionesPorLenguaje)
  );

  /**
   * Genera el valor CSS `conic-gradient` para el gráfico circular
   * según el porcentaje acumulado de cada lenguaje.
   */
  readonly fondoDonut = computed(() => {
    const lenguajes = this.lenguajes();
    if (lenguajes.length === 0) return '#303449';

    let acumulado = 0;
    const tramos = lenguajes.map((l) => {
      const inicio = acumulado;
      acumulado += l.porcentaje;
      return `${l.color} ${inicio}% ${acumulado}%`;
    });
    return `conic-gradient(${tramos.join(', ')})`;
  });

  // Gráfico de barras mensual
  /** Serie mensual formateada para el gráfico de barras. */
  readonly estadisticasMensuales = computed<EstadisticaMensual[]>(() =>
    (this.estadisticas()?.actividadMensual ?? []).map((a) => ({
      mes: this.estadisticasService.etiquetaMes(a.periodo),
      cantidad: a.traducciones,
    }))
  );

  /** Valor máximo calculado para el eje Y del gráfico de barras. */
  private readonly maximoBarras = computed(() =>
    this.estadisticasService.maximoEje(this.estadisticasMensuales().map((e) => e.cantidad), DIVISIONES_EJE)
  );

  /** Etiquetas numéricas del eje Y del gráfico de barras. */
  readonly marcasBarras = computed(() =>
    this.estadisticasService.marcasEje(this.maximoBarras(), DIVISIONES_EJE)
  );

  /**
   * Carga en paralelo usuarios, solicitudes y estadísticas generales al iniciar la vista.
   */
  ngOnInit(): void {
    forkJoin({
      usuarios: this.usuarioService.getAll(),
      solicitudes: this.estadisticasService.solicitudes(),
      estadisticas: this.estadisticasService.obtener(),
    }).subscribe({
      next: ({ usuarios, solicitudes, estadisticas }) => {
        // /user/getall responde 204 sin cuerpo cuando no hay usuarios.
        this.usuarios.set(Array.isArray(usuarios) ? usuarios : []);
        this.solicitudes.set(Array.isArray(solicitudes) ? solicitudes : []);
        this.estadisticas.set(estadisticas);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al consultar los reportes:', error);
        this.error.set(this.estadisticasService.mensajeErrorCarga(error));
        this.cargando.set(false);
      },
    });
  }

  /**
   * Calcula la altura porcentual de una barra respecto al máximo del eje Y.
   * @param cantidad Cantidad de solicitudes del mes.
   * @returns Porcentaje numérico entre 0 y 100.
   */
>>>>>>> Stashed changes
  obtenerAlturaBarra(cantidad: number): number {
    const maximo = Math.max(...this.estadisticasMensuales.map(item => item.cantidad));
    return maximo > 0 ? (cantidad / maximo) * 100 : 0;
  }

  /**
   * Genera y descarga el reporte de usuarios en formato CSV.
   */
  descargarReporteUsuarios(): void {
    const encabezados = ['ID', 'Nombre', 'Correo', 'Fecha de registro', 'Estado'];

    const filas = this.usuarios.map(usuario => [
      usuario.id,
      usuario.nombre,
      usuario.correo,
      usuario.fechaRegistro,
      usuario.estado
    ]);

    this.descargarCSV('reporte_usuarios.csv', encabezados, filas);
  }

  /**
   * Genera y descarga el reporte de solicitudes en formato CSV.
   */
  descargarReporteSolicitudes(): void {
    const encabezados = ['ID', 'Usuario', 'Tipo de solicitud', 'Fecha', 'Estado'];

    const filas = this.solicitudes.map(solicitud => [
      solicitud.id,
      solicitud.usuario,
      solicitud.tipo,
      solicitud.fecha,
      solicitud.estado
    ]);

    this.descargarCSV('reporte_solicitudes.csv', encabezados, filas);
  }

  /**
   * Construye un archivo CSV delimitado por punto y coma con BOM UTF-8
   * y dispara su descarga en el navegador.
   * @param nombreArchivo Nombre del archivo de salida (ej. `'reporte_usuarios.csv'`).
   * @param encabezados Nombres de las columnas del reporte.
   * @param filas Matriz de valores correspondientes a cada registro.
   */
  private descargarCSV(
    nombreArchivo: string,
    encabezados: (string | number)[],
    filas: (string | number)[][]
  ): void {
    const contenido = [encabezados, ...filas]
      .map(fila =>
        fila.map(valor => `"${String(valor).replace(/"/g, '""')}"`).join(';')
      )
      .join('\n');

    const archivo = new Blob(
      ['\uFEFF' + contenido],
      { type: 'text/csv;charset=utf-8;' }
    );

    const url = URL.createObjectURL(archivo);
    const enlace = document.createElement('a');

    enlace.href = url;
    enlace.download = nombreArchivo;
    enlace.click();

    URL.revokeObjectURL(url);
  }}
