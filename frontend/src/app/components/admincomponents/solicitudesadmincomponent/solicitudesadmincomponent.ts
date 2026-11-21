import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Solicitud } from '../../../models/solicitud.model';
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
