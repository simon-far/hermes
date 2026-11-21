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

@Component({
  selector: 'app-reportesadmincomponent',
  standalone: false,
  styleUrl: './reportesadmincomponent.css',
  templateUrl: './reportesadmincomponent.html',
})
export class Reportesadmincomponent implements OnInit {
  private readonly estadisticasService = inject(EstadisticasService);
  private readonly usuarioService = inject(UsuarioService);

  readonly usuarios = signal<User[]>([]);
  readonly solicitudes = signal<Solicitud[]>([]);
  private readonly estadisticas = signal<Estadisticas | null>(null);
  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);

  // Resumen
  readonly totalUsuarios = computed(() => this.usuarios().length);
  readonly totalSolicitudes = computed(() => this.solicitudes().length);
  readonly solicitudesMesActual = computed(
    () => this.estadisticas()?.actividadMensual.at(-1)?.traducciones ?? 0
  );
  readonly totalLenguajes = computed(
    () => Object.keys(this.estadisticas()?.traduccionesPorLenguaje ?? {}).length
  );

  // Gráfico circular por lenguaje de destino
  readonly lenguajes = computed(() =>
    this.estadisticasService.lenguajesOrdenados(this.estadisticas()?.traduccionesPorLenguaje)
  );

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
  readonly estadisticasMensuales = computed<EstadisticaMensual[]>(() =>
    (this.estadisticas()?.actividadMensual ?? []).map((a) => ({
      mes: this.estadisticasService.etiquetaMes(a.periodo),
      cantidad: a.traducciones,
    }))
  );

  private readonly maximoBarras = computed(() =>
    this.estadisticasService.maximoEje(this.estadisticasMensuales().map((e) => e.cantidad), DIVISIONES_EJE)
  );

  readonly marcasBarras = computed(() =>
    this.estadisticasService.marcasEje(this.maximoBarras(), DIVISIONES_EJE)
  );

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

  // Altura de cada barra respecto al máximo del eje
  obtenerAlturaBarra(cantidad: number): number {
    return (cantidad / this.maximoBarras()) * 100;
  }

  // Descargar reporte de usuarios
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

  // Descargar reporte de solicitudes
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

  // Construir y descargar el archivo CSV
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
