import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Solicitud } from '../../../models/admin/solicitud.model';
import { EstadisticasService } from '../../../services/estadisticas.service';
import { esDelMesActual, formatearFecha, mensajeErrorCarga, textoLenguajes } from '../admin-formato';

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

  readonly totalMesActual = computed(() => this.solicitudes().filter((s) => esDelMesActual(s.fecha)).length);

  readonly totalUsuariosConSolicitudes = computed(
    () => new Set(this.solicitudes().map((s) => s.correo)).size
  );

  /** Lenguajes de destino presentes en las solicitudes, para el filtro. */
  readonly lenguajesDisponibles = computed(() =>
    [...new Set(this.solicitudes().map((s) => this.lenguajeDestino(s)))].sort((a, b) => a.localeCompare(b))
  );

  readonly textoLenguajes = textoLenguajes;
  readonly formatearFecha = formatearFecha;

  ngOnInit(): void {
    this.estadisticasService.solicitudes().subscribe({
      next: (respuesta) => {
        this.solicitudes.set(Array.isArray(respuesta) ? respuesta : []);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al consultar las solicitudes:', error);
        this.error.set(mensajeErrorCarga(error));
        this.cargando.set(false);
      },
    });
  }

  get solicitudesFiltradas(): Solicitud[] {
    const termino = this.busqueda.trim().toLowerCase();

    return this.solicitudes().filter((solicitud) => {
      const coincideBusqueda =
        !termino ||
        [solicitud.usuario, solicitud.correo, textoLenguajes(solicitud), solicitud.modelo]
          .some((campo) => campo?.toLowerCase().includes(termino));

      const coincideLenguaje =
        this.filtroLenguaje === 'Todos' ||
        this.lenguajeDestino(solicitud) === this.filtroLenguaje;

      return coincideBusqueda && coincideLenguaje;
    });
  }

  private lenguajeDestino(solicitud: Solicitud): string {
    return solicitud.lenguajeDestino?.trim() || 'Sin especificar';
  }
}
