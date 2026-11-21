import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Actividad, DatoGrafica, Estadistica } from '../../../models/admin/panel.models';
import { UsuarioService } from '../../../services/usuario.service';
import { EstadisticasService } from '../../../services/estadisticas.service';
import { Estadisticas } from '../../../models/estadisticas.model';

@Component({
  selector: 'app-principaladmincomponent',
  standalone: false,
  styleUrl: './principaladmincomponent.css',
  templateUrl: './principaladmincomponent.html',
})
export class Principaladmincomponent implements OnInit {
  private readonly estadisticasService = inject(EstadisticasService);

  // 1. Signal que guarda toda la respuesta de /estadisticas
  datosEstadisticas = signal<Estadisticas>({
    totalUsuarios: 0,
    totalTraducciones: 0,
    traduccionesPorLenguaje: {},
  });

  // 2. Llamada única al backend al iniciar
  ngOnInit(): void {
    this.estadisticasService.obtenerEstadisticas().subscribe({
      next: (datos) => {
        console.log('Estadísticas recibidas:', datos);
        this.datosEstadisticas.set(datos);
      },
      error: (err) => console.error('Error al traer estadísticas:', err),
    });
  }

  // 3. Tarjetas superiores conectadas a datos reales
  estadisticas = computed<Estadistica[]>(() => {
    const info = this.datosEstadisticas();
    const cantidadLenguajes = Object.keys(info.traduccionesPorLenguaje || {}).length;

    return [
      {
        titulo: 'Usuarios registrados',
        valor: info.totalUsuarios, // <-- Dato real de EstadisticasDTO
        descripcion: 'Usuarios en la plataforma',
        icono: 'fa-solid fa-users',
        variacion: 'Activos en Hermes',
        color: 'purple',
      },
      {
        titulo: 'Solicitudes recibidas',
        valor: info.totalTraducciones, // <-- Dato real de EstadisticasDTO
        descripcion: 'Traducciones realizadas',
        icono: 'fa-solid fa-file-lines',
        variacion: 'Total acumulado',
        color: 'blue',
      },
      {
        titulo: 'Lenguajes utilizados',
        valor: cantidadLenguajes, // <-- Dato real extraído del Map
        descripcion: 'Lenguajes con traducciones',
        icono: 'fa-solid fa-code',
        color: 'orange',
      },
      {
        titulo: 'Solicitudes atendidas',
        valor: info.totalTraducciones, // <-- Todas las guardadas fueron atendidas
        descripcion: 'Traducciones completadas',
        icono: 'fa-solid fa-circle-check',
        variacion: '100% atendidas',
        color: 'green',
      },
    ];
  });

  // 4. Variables del bloque inferior sincronizadas con el dato real
  get totalSolicitudes(): number {
    return this.datosEstadisticas().totalTraducciones;
  }

  get solicitudesAtendidas(): number {
    return this.datosEstadisticas().totalTraducciones;
  }

  solicitudesPendientes = 0;

  datosGrafica: DatoGrafica[] = [
    { periodo: 'May', usuarios: 35, solicitudes: 45 },
    { periodo: 'Jun', usuarios: 48, solicitudes: 60 },
    { periodo: 'Jul', usuarios: 62, solicitudes: 55 },
    { periodo: 'Ago', usuarios: 75, solicitudes: 80 },
    { periodo: 'Sep', usuarios: 90, solicitudes: 95 },
  ];

  actividadesRecientes: Actividad[] = [
    {
      titulo: 'Nuevo usuario registrado',
      descripcion: 'Un usuario creó una cuenta en la plataforma.',
      fecha: 'Hace 5 min',
      tipo: 'user',
      icono: 'fa-solid fa-user-plus',
    },
  ];

  obtenerPorcentaje(valor: number): number {
    return this.totalSolicitudes > 0 ? (valor / this.totalSolicitudes) * 100 : 0;
  }

  obtenerAltura(valor: number): string {
    return `${Math.min(valor, 100)}%`;
  }
}
