import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { EstadisticaMensual } from '../../../models/reportes.models';
import { Estadisticas } from '../../../models/estadisticas.models';
import { Solicitud } from '../../../models/solicitud.model';
import { User } from '../../../models/usuarios.model';
import { EstadisticasService } from '../../../services/estadisticas.service';
import { UsuarioService } from '../../../services/usuario.service';

/** Divisiones del eje Y del gráfico mensual (4 marcas). */
const DIVISIONES_EJE = 3;

/**
 * Componente de reportes y estadísticas del panel de administración.
 * Consulta usuarios, solicitudes y métricas generales para renderizar
 * los gráficos de distribución y habilitar la exportación a CSV.
 */
@Component({
  selector: 'app-reportesadmincomponent',
  standalone: false,
  styleUrl: './reportesadmincomponent.css',
  templateUrl: './reportesadmincomponent.html',
})
export class Reportesadmincomponent implements OnInit {
  private readonly estadisticasService = inject(EstadisticasService);
  private readonly usuarioService = inject(UsuarioService);

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
  obtenerAlturaBarra(cantidad: number): number {
    return (cantidad / this.maximoBarras()) * 100;
  }

  /**
   * Genera y descarga el reporte de usuarios en formato CSV.
   */
  descargarReporteUsuarios(): void {
    const encabezados = ['ID', 'Usuario', 'Correo', 'Rol', 'Fecha de registro'];

    const filas = this.usuarios().map((usuario) => [
      usuario.id,
      usuario.username ?? '',
      usuario.email ?? '',
      usuario.rol ?? '',
      this.estadisticasService.formatearFecha(usuario.fechaRegistro),
    ]);

    this.descargarCSV('reporte_usuarios.csv', encabezados, filas);
  }

  /**
   * Genera y descarga el reporte de solicitudes en formato CSV.
   */
  descargarReporteSolicitudes(): void {
    const encabezados = ['ID', 'Usuario', 'Correo', 'Lenguaje de origen', 'Lenguaje de destino', 'Modelo', 'Fecha'];

    const filas = this.solicitudes().map((solicitud) => [
      solicitud.id,
      solicitud.usuario ?? '',
      solicitud.correo ?? '',
      solicitud.lenguajeOrigen ?? '',
      solicitud.lenguajeDestino ?? '',
      solicitud.modelo ?? '',
      this.estadisticasService.formatearFecha(solicitud.fecha),
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
      ['﻿' + contenido],
      { type: 'text/csv;charset=utf-8;' }
    );

    const url = URL.createObjectURL(archivo);
    const enlace = document.createElement('a');

    enlace.href = url;
    enlace.download = nombreArchivo;
    enlace.click();

    URL.revokeObjectURL(url);
  }
}
