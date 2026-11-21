import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Actividad, DatoGrafica, Estadistica } from '../../../models/admin/panel.models';
import { Estadisticas } from '../../../models/admin/estadisticas.models';
import { EstadisticasService } from '../../../services/estadisticas.service';
import {
  etiquetaMes,
  lenguajesOrdenados,
  marcasEje,
  maximoEje,
  mensajeErrorCarga,
  textoLenguajes,
  tiempoRelativo,
} from '../admin-formato';

/** Divisiones del eje Y de la gráfica de actividad (5 marcas). */
const DIVISIONES_EJE = 4;

@Component({
  selector: 'app-principaladmincomponent',
  standalone: false,
  styleUrl: './principaladmincomponent.css',
  templateUrl: './principaladmincomponent.html',
})
export class Principaladmincomponent implements OnInit {
  private readonly estadisticasService = inject(EstadisticasService);

  private readonly datos = signal<Estadisticas | null>(null);
  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);

  readonly totalSolicitudes = computed(() => this.datos()?.totalTraducciones ?? 0);

  /** Actividad del mes en curso (último elemento de la lista mensual). */
  private readonly mesActual = computed(() => this.datos()?.actividadMensual.at(-1));

  readonly lenguajes = computed(() => lenguajesOrdenados(this.datos()?.traduccionesPorLenguaje));

  readonly estadisticas = computed<Estadistica[]>(() => {
    const datos = this.datos();
    const mes = this.mesActual();
    const lenguajes = this.lenguajes();

    return [
      {
        titulo: 'Usuarios registrados',
        valor: datos?.totalUsuarios ?? 0,
        descripcion: 'Usuarios en la plataforma',
        icono: 'fa-solid fa-users',
        variacion: mes?.usuarios ? `+${mes.usuarios} este mes` : undefined,
        color: 'purple',
      },
      {
        titulo: 'Solicitudes totales',
        valor: datos?.totalTraducciones ?? 0,
        descripcion: 'Traducciones realizadas',
        icono: 'fa-solid fa-file-lines',
        variacion: mes?.traducciones ? `+${mes.traducciones} este mes` : undefined,
        color: 'blue',
      },
      {
        titulo: 'Solicitudes este mes',
        valor: mes?.traducciones ?? 0,
        descripcion: 'Durante el mes en curso',
        icono: 'fa-solid fa-calendar-days',
        color: 'orange',
      },
      {
        titulo: 'Lenguajes utilizados',
        valor: Object.keys(datos?.traduccionesPorLenguaje ?? {}).length,
        descripcion: lenguajes.length ? `Más solicitado: ${lenguajes[0].lenguaje}` : 'Sin solicitudes aún',
        icono: 'fa-solid fa-code',
        color: 'green',
      },
    ];
  });

  readonly datosGrafica = computed<DatoGrafica[]>(() =>
    (this.datos()?.actividadMensual ?? []).map((a) => ({
      periodo: etiquetaMes(a.periodo),
      usuarios: a.usuarios,
      solicitudes: a.traducciones,
    }))
  );

  /** Valor máximo del eje Y según los datos reales. */
  private readonly maximoGrafica = computed(() =>
    maximoEje(
      this.datosGrafica().flatMap((d) => [d.usuarios, d.solicitudes]),
      DIVISIONES_EJE
    )
  );

  readonly marcasGrafica = computed(() => marcasEje(this.maximoGrafica(), DIVISIONES_EJE));

  /** Solo actividad de solicitudes: no hay forma de saber qué usuarios están conectados. */
  readonly actividadesRecientes = computed<Actividad[]>(() =>
    (this.datos()?.ultimasSolicitudes ?? []).map((s) => ({
      titulo: `Nueva solicitud: ${textoLenguajes(s)}`,
      descripcion: `Realizada por ${s.usuario}${s.modelo ? ' con el modelo ' + s.modelo : ''}.`,
      fecha: tiempoRelativo(s.fecha),
      icono: 'fa-solid fa-inbox',
      tipo: 'blue',
    }))
  );

  ngOnInit(): void {
    this.estadisticasService.obtener().subscribe({
      next: (datos) => {
        this.datos.set(datos);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al consultar las estadísticas:', error);
        this.error.set(mensajeErrorCarga(error));
        this.cargando.set(false);
      },
    });
  }

  // Altura de cada barra respecto al máximo del eje.
  obtenerAltura(valor: number): string {
    return `${(valor / this.maximoGrafica()) * 100}%`;
  }
}
