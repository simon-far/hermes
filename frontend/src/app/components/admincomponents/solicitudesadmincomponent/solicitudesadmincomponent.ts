import { Component, computed, HostListener, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Solicitud, SolicitudDetalle } from '../../../models/solicitud.model';
import { EstadisticasService } from '../../../services/estadisticas.service';

@Component({
  selector: 'app-solicitudesadmincomponent',
  standalone: false,
  styleUrl: './solicitudesadmincomponent.css',
  templateUrl: './solicitudesadmincomponent.html',
})
export class Solicitudesadmincomponent implements OnInit {
  private readonly estadisticasService = inject(EstadisticasService);

  busqueda = '';

  /** Lenguaje de destino seleccionado en el filtro ('Todos' = sin filtro). */
  filtroLenguaje = 'Todos';

  readonly solicitudes = signal<Solicitud[]>([]);
  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);

  // Ventana de detalle
  /** Solicitud cuya ventana de detalle está abierta (null = cerrada). */
  readonly solicitudSeleccionada = signal<Solicitud | null>(null);
  /** Detalle completo (código y mejoras) cargado desde el backend. */
  readonly detalle = signal<SolicitudDetalle | null>(null);
  readonly cargandoDetalle = signal(false);
  readonly errorDetalle = signal<string | null>(null);
  /** Petición de detalle en curso; se cancela si se cierra o se abre otra solicitud. */
  private peticionDetalle?: Subscription;

  readonly totalMesActual = computed(
    () => this.solicitudes().filter((s) => this.esDelMesActual(s.fecha)).length
  );

  readonly totalUsuariosConSolicitudes = computed(
    () => new Set(this.solicitudes().map((s) => s.correo)).size
  );

  /** Lenguajes de destino presentes en las solicitudes, para el filtro. */
  readonly lenguajesDisponibles = computed(() =>
    [...new Set(this.solicitudes().map((s) => this.lenguajeDestino(s)))].sort((a, b) => a.localeCompare(b))
  );

  ngOnInit(): void {
    this.estadisticasService.solicitudes().subscribe({
      next: (respuesta) => {
        this.solicitudes.set(Array.isArray(respuesta) ? respuesta : []);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al consultar las solicitudes:', error);
        this.error.set(this.estadisticasService.mensajeErrorCarga(error));
        this.cargando.set(false);
      },
    });
  }

  get solicitudesFiltradas(): Solicitud[] {
    const termino = this.busqueda.trim().toLowerCase();

    return this.solicitudes().filter((solicitud) => {
      const coincideBusqueda =
        !termino ||
        [solicitud.usuario, solicitud.correo, this.textoLenguajes(solicitud), solicitud.modelo]
          .some((campo) => campo?.toLowerCase().includes(termino));

      const coincideLenguaje =
        this.filtroLenguaje === 'Todos' ||
        this.lenguajeDestino(solicitud) === this.filtroLenguaje;

      return coincideBusqueda && coincideLenguaje;
    });
  }

  /** 'Java → Python' (lo usa la tabla y la búsqueda). */
  textoLenguajes(solicitud: Solicitud): string {
    return this.estadisticasService.textoLenguajes(solicitud);
  }

  /** Fecha en formato dd/mm/aaaa para la tabla. */
  formatearFecha(fecha: string | null): string {
    return this.estadisticasService.formatearFecha(fecha);
  }

  /** Fecha con hora para la ventana de detalle. */
  formatearFechaHora(fecha: string | null): string {
    return this.estadisticasService.formatearFechaHora(fecha);
  }

  // ---------- Detalle ----------

  /**
   * Abre la ventana de detalle: muestra de inmediato los datos de la fila y
   * pide al backend el código original, el traducido y las mejoras.
   * @param solicitud Solicitud seleccionada en la tabla.
   */
  verDetalle(solicitud: Solicitud): void {
    this.peticionDetalle?.unsubscribe();
    this.solicitudSeleccionada.set(solicitud);
    this.detalle.set(null);
    this.errorDetalle.set(null);
    this.cargandoDetalle.set(true);

    this.peticionDetalle = this.estadisticasService.detalleSolicitud(solicitud.id).subscribe({
      next: (detalle) => {
        this.detalle.set(detalle);
        this.cargandoDetalle.set(false);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al consultar el detalle de la solicitud:', error);
        this.errorDetalle.set(
          error.status === 404
            ? 'Esta solicitud ya no existe; es posible que el usuario la haya eliminado.'
            : this.estadisticasService.mensajeErrorCarga(error)
        );
        this.cargandoDetalle.set(false);
      },
    });
  }

  /** Cierra la ventana de detalle y cancela la petición pendiente. */
  @HostListener('document:keydown.escape')
  cerrarDetalle(): void {
    this.peticionDetalle?.unsubscribe();
    this.solicitudSeleccionada.set(null);
    this.detalle.set(null);
    this.errorDetalle.set(null);
    this.cargandoDetalle.set(false);
  }

  private lenguajeDestino(solicitud: Solicitud): string {
    return solicitud.lenguajeDestino?.trim() || 'Sin especificar';
  }

  /** Indica si la fecha cae en el mes en curso. */
  private esDelMesActual(fecha: string | null): boolean {
    const d = this.estadisticasService.aFecha(fecha);
    const ahora = new Date();
    return !!d && d.getFullYear() === ahora.getFullYear() && d.getMonth() === ahora.getMonth();
  }
}
