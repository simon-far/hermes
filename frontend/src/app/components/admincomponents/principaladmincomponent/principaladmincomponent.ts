import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Actividad, DatoGrafica, Estadistica } from '../../../models/panel.models';
import { Estadisticas } from '../../../models/estadisticas.models';
import { EstadisticasService } from '../../../services/estadisticas.service';

/** Divisiones del eje Y de la gráfica de actividad (5 marcas). */
const DIVISIONES_EJE = 4;

/**
 * Componente principal del panel de administración.
 * Consulta las estadísticas generales de la plataforma y deriva los indicadores,
 * la distribución por lenguajes, la gráfica de actividad mensual y el listado reciente.
 */
@Component({
  selector: 'app-principaladmincomponent',
  standalone: false,
  styleUrl: './principaladmincomponent.css',
  templateUrl: './principaladmincomponent.html',
})
export class Principaladmincomponent implements OnInit {
  private readonly estadisticasService = inject(EstadisticasService);

  /** Respuesta cruda de estadísticas obtenida del backend. */
  private readonly datos = signal<Estadisticas | null>(null);
  /** Indica si la consulta inicial de estadísticas sigue en curso. */
  readonly cargando = signal(true);
  /** Mensaje de error en caso de fallar la carga de datos. */
  readonly error = signal<string | null>(null);

  /** Total acumulado de solicitudes de traducción. */
  readonly totalSolicitudes = computed(() => this.datos()?.totalTraducciones ?? 0);

  /** Actividad del mes en curso (último elemento de la lista mensual). */
  private readonly mesActual = computed(() => this.datos()?.actividadMensual.at(-1));

  /** Distribución de lenguajes ordenados de mayor a menor demanda. */
  readonly lenguajes = computed(() =>
    this.estadisticasService.lenguajesOrdenados(this.datos()?.traduccionesPorLenguaje)
  );

  /** Tarjetas de indicadores principales mostradas en el resumen superior. */
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

  /** Serie mensual formateada para renderizar las columnas de la gráfica. */
  readonly datosGrafica = computed<DatoGrafica[]>(() =>
    (this.datos()?.actividadMensual ?? []).map((a) => ({
      periodo: this.estadisticasService.etiquetaMes(a.periodo),
      usuarios: a.usuarios,
      solicitudes: a.traducciones,
    }))
  );

  /** Valor máximo del eje Y según los datos reales. */
  private readonly maximoGrafica = computed(() =>
    this.estadisticasService.maximoEje(
      this.datosGrafica().flatMap((d) => [d.usuarios, d.solicitudes]),
      DIVISIONES_EJE
    )
  );

  /** Etiquetas numéricas del eje Y generadas a partir del valor máximo. */
  readonly marcasGrafica = computed(() =>
    this.estadisticasService.marcasEje(this.maximoGrafica(), DIVISIONES_EJE)
  );

  /** Solo actividad de solicitudes: no hay forma de saber qué usuarios están conectados. */
  readonly actividadesRecientes = computed<Actividad[]>(() =>
    (this.datos()?.ultimasSolicitudes ?? []).map((s) => ({
      titulo: `Nueva solicitud: ${this.estadisticasService.textoLenguajes(s)}`,
      descripcion: `Realizada por ${s.usuario}${s.modelo ? ' con el modelo ' + s.modelo : ''}.`,
      fecha: this.tiempoRelativo(s.fecha),
      icono: 'fa-solid fa-inbox',
      tipo: 'blue',
    }))
  );

  /**
   * Inicializa el componente solicitando las estadísticas generales al servicio.
   */
  ngOnInit(): void {
    this.estadisticasService.obtener().subscribe({
      next: (datos) => {
        this.datos.set(datos);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al consultar las estadísticas:', error);
        this.error.set(this.estadisticasService.mensajeErrorCarga(error));
        this.cargando.set(false);
      },
    });
  }

  /**
   * Calcula la altura porcentual de una barra respecto al máximo del eje Y.
   * @param valor Cantidad numérica representada por la barra.
   * @returns Altura en formato CSS porcentual (por ejemplo, `'45%'`).
   */
  obtenerAltura(valor: number): string {
    return `${(valor / this.maximoGrafica()) * 100}%`;
  }

  /**
   * Formatea una fecha en texto relativo como `'Hace 10 minutos'` o `'Hace 2 días'`
   * (muestra la fecha completa si pasó un mes).
   * @param fecha Cadena de fecha recibida del backend o `null`.
   * @returns Texto legible del tiempo transcurrido.
   */
  private tiempoRelativo(fecha: string | null): string {
    const d = this.estadisticasService.aFecha(fecha);
    if (!d) return 'Sin fecha';

    const minutos = Math.floor((Date.now() - d.getTime()) / 60000);
    if (minutos < 1) return 'Hace un momento';
    if (minutos < 60) return `Hace ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;

    const horas = Math.floor(minutos / 60);
    if (horas < 24) return `Hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;

    const dias = Math.floor(horas / 24);
    if (dias < 30) return `Hace ${dias} ${dias === 1 ? 'día' : 'días'}`;

    return this.estadisticasService.formatearFecha(fecha);
  }
}
