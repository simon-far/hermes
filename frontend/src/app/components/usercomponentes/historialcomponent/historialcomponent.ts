import {Component} from '@angular/core';

type TipoOperacion = 'Traducción' | 'Mejora';
type Lenguaje = 'Java' | 'JavaScript' | 'Python';

interface ArchivoHistorial {
  id: number;
  nombre: string;
  lenguaje: Lenguaje;
  operacion: TipoOperacion;
  fecha: string;
  tamano: string;
  extension: string;
}

/**
 * Componente del historial personal de traducciones del usuario.
 * Permite listar, filtrar, editar y eliminar traducciones guardadas en su cuenta.
 */
@Component({
  selector: 'app-historialcomponent',
  standalone: false,
  styleUrl: './historialcomponent.css',
  templateUrl: './historialcomponent.html',
})
<<<<<<< Updated upstream
export class Historialcomponent {
=======
export class Historialcomponent implements OnInit {
  private readonly historialService = inject(HistorialService);
  private readonly loginServicio = inject(LoginService);
  private readonly snackBar = inject(MatSnackBar);

  /** Catálogo de lenguajes disponibles para filtros y edición. */
  readonly lenguajes = LENGUAJES_HISTORIAL;

  /** Listado completo de traducciones del usuario autenticado. */
  traducciones = signal<TraduccionHistorial[]>([]);

  /** Indica si la consulta del historial está en curso. */
  cargando = signal(false);

  /** Mensaje de error mostrado cuando falla la carga inicial. */
  errorCarga = signal<string | null>(null);

  /** Estado actual de autenticación del usuario. */
  logueado = signal(this.loginServicio.estaLogueado());

  /** Término de búsqueda aplicado sobre el código y los lenguajes. */
>>>>>>> Stashed changes
  busqueda = '';

  /** Lenguaje seleccionado en el filtro (`'todos'` para no filtrar). */
  filtroLenguaje = 'todos';
  filtroOperacion = 'todas';

<<<<<<< Updated upstream
  archivos: ArchivoHistorial[] = [
    {
      id: 1,
      nombre: 'codigo_optimizado',
      lenguaje: 'Java',
      operacion: 'Mejora',
      fecha: '02 nov. 2026',
      tamano: '12 KB',
      extension: '.java'
    },
    {
      id: 2,
      nombre: 'traductor_script',
      lenguaje: 'Python',
      operacion: 'Traducción',
      fecha: '01 nov. 2026',
      tamano: '8 KB',
      extension: '.py'
    },
    {
      id: 3,
      nombre: 'app_refactorizado',
      lenguaje: 'JavaScript',
      operacion: 'Mejora',
      fecha: '30 oct. 2026',
      tamano: '15 KB',
      extension: '.js'
    },
    {
      id: 4,
      nombre: 'algoritmo_conversion',
      lenguaje: 'Java',
      operacion: 'Traducción',
      fecha: '28 oct. 2026',
      tamano: '10 KB',
      extension: '.java'
    },
    {
      id: 5,
      nombre: 'funciones_limpias',
      lenguaje: 'Python',
      operacion: 'Mejora',
      fecha: '26 oct. 2026',
      tamano: '6 KB',
      extension: '.py'
    },
    {
      id: 6,
      nombre: 'calculadora_web',
      lenguaje: 'JavaScript',
      operacion: 'Traducción',
      fecha: '24 oct. 2026',
      tamano: '18 KB',
      extension: '.js'
=======
  /** Total de traducciones guardadas en el historial. */
  totalTraducciones = computed(() => this.traducciones().length);

  /** Cantidad de lenguajes distintos usados como origen o destino. */
  totalLenguajes = computed(() => {
    const usados = new Set<string>();
    this.traducciones().forEach((t) => {
      if (t.lenguajeOrigen) usados.add(t.lenguajeOrigen.toUpperCase());
      if (t.lenguajeDestino) usados.add(t.lenguajeDestino.toUpperCase());
    });
    return usados.size;
  });

  /** Fecha de la traducción más reciente (la lista llega ordenada descendentemente). */
  ultimaTraduccion = computed(() => this.traducciones()[0]?.fecha ?? null);

  // Ventana de modificación
  traduccionEditando = signal<TraduccionHistorial | null>(null);
  formulario: TraduccionHistorialActualizacion = {
    codigoOriginal: '',
    codigoTraducido: '',
    lenguajeOrigen: '',
    lenguajeDestino: '',
  };
  guardando = false;

  // Confirmación de eliminación
  traduccionAEliminar = signal<TraduccionHistorial | null>(null);
  eliminando = false;

  /**
   * Inicializa el componente solicitando el historial del usuario si tiene sesión activa.
   */
  ngOnInit(): void {
    this.cargarHistorial();
  }

  /**
   * Consulta el historial del usuario autenticado.
   * Si el servidor responde 401/403, cierra la sesión local y actualiza el estado.
   */
  cargarHistorial(): void {
    this.logueado.set(this.loginServicio.estaLogueado());
    if (!this.logueado()) {
      this.traducciones.set([]);
      return;
>>>>>>> Stashed changes
    }
  ];

<<<<<<< Updated upstream
  get archivosFiltrados(): ArchivoHistorial[] {
    return this.archivos.filter(archivo => {
      const coincideNombre = archivo.nombre
        .toLowerCase()
        .includes(this.busqueda.toLowerCase());
=======
    this.cargando.set(true);
    this.errorCarga.set(null);
    this.historialService
      .listar()
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (lista) => this.traducciones.set(Array.isArray(lista) ? lista : []),
        error: (error: HttpErrorResponse) => {
          if (error.status === 401 || error.status === 403) {
            this.loginServicio.cerrarSesion();
            this.logueado.set(false);
            return;
          }
          this.errorCarga.set(this.obtenerMensajeError(error, 'No fue posible cargar tu historial.'));
        },
      });
  }

  /**
   * Devuelve las traducciones que coinciden con el texto buscado y el lenguaje filtrado.
   * @returns Lista filtrada de traducciones.
   */
  get traduccionesFiltradas(): TraduccionHistorial[] {
    const termino = this.busqueda.trim().toLowerCase();

    return this.traducciones().filter((t) => {
      const coincideBusqueda =
        !termino ||
        t.codigoOriginal?.toLowerCase().includes(termino) ||
        t.codigoTraducido?.toLowerCase().includes(termino) ||
        this.etiquetaLenguaje(t.lenguajeOrigen).toLowerCase().includes(termino) ||
        this.etiquetaLenguaje(t.lenguajeDestino).toLowerCase().includes(termino);
>>>>>>> Stashed changes

      const coincideLenguaje =
        this.filtroLenguaje === 'todos' ||
        archivo.lenguaje === this.filtroLenguaje;

      const coincideOperacion =
        this.filtroOperacion === 'todas' ||
        archivo.operacion === this.filtroOperacion;

      return coincideNombre && coincideLenguaje && coincideOperacion;
    });
  }

<<<<<<< Updated upstream
  get totalTraducciones(): number {
    return this.archivos.filter(
      archivo => archivo.operacion === 'Traducción'
    ).length;
  }

  get totalMejoras(): number {
    return this.archivos.filter(
      archivo => archivo.operacion === 'Mejora'
    ).length;
  }

  get totalLenguajes(): number {
    return new Set(this.archivos.map(archivo => archivo.lenguaje)).size;
  }

  obtenerIcono(lenguaje: Lenguaje): string {
    const iconos: Record<Lenguaje, string> = {
      Java: 'fa-brands fa-java',
      JavaScript: 'fa-brands fa-js',
      Python: 'fa-brands fa-python'
    };

    return iconos[lenguaje];
  }

=======
  /**
   * Restablece la barra de búsqueda y el selector de lenguaje a sus valores iniciales.
   */
>>>>>>> Stashed changes
  limpiarFiltros(): void {
    this.busqueda = '';
    this.filtroLenguaje = 'todos';
    this.filtroOperacion = 'todas';
  }

<<<<<<< Updated upstream
=======
  /**
   * Abre el modal global de inicio de sesión definido en el encabezado.
   */
  abrirLogin(): void {
    const elemento = document.getElementById('modalLogin');
    if (elemento) {
      bootstrap.Modal.getOrCreateInstance(elemento).show();
    }
  }

  // ---------- Presentación ----------

  /**
   * Obtiene el nombre legible de un lenguaje a partir de su código.
   * @param codigo Código del lenguaje (ej. `'PYTHON'`).
   * @returns Etiqueta amigable o `'Desconocido'` si no existe.
   */
  etiquetaLenguaje(codigo: string | null | undefined): string {
    if (!codigo) return 'Desconocido';
    const encontrado = this.lenguajes.find((l) => l.valor === codigo.toUpperCase());
    return encontrado ? encontrado.etiqueta : codigo;
  }

  /**
   * Devuelve la clase de ícono de Font Awesome asociada a un lenguaje.
   * @param codigo Código del lenguaje.
   * @returns Clases CSS del ícono correspondiente.
   */
  iconoLenguaje(codigo: string | null | undefined): string {
    switch (codigo?.toUpperCase()) {
      case 'JAVA':
        return 'fa-brands fa-java';
      case 'JAVASCRIPT':
        return 'fa-brands fa-js';
      case 'PYTHON':
        return 'fa-brands fa-python';
      default:
        return 'fa-solid fa-code';
    }
  }

  /**
   * Devuelve la clase CSS de color para el chip de un lenguaje.
   * @param codigo Código del lenguaje.
   * @returns Nombre de clase CSS definida en el componente.
   */
  claseLenguaje(codigo: string | null | undefined): string {
    switch (codigo?.toUpperCase()) {
      case 'JAVA':
        return 'lang-java';
      case 'JAVASCRIPT':
        return 'lang-js';
      case 'TYPESCRIPT':
        return 'lang-ts';
      case 'PYTHON':
        return 'lang-python';
      case 'CPP':
        return 'lang-cpp';
      case 'CSHARP':
        return 'lang-csharp';
      default:
        return 'lang-otro';
    }
  }

  /**
   * Formatea una fecha ISO al formato local colombiano (`es-CO`).
   * @param fecha Cadena de fecha o `null`.
   * @returns Fecha formateada o `'Sin fecha'` si no es válida.
   */
  formatearFecha(fecha: string | null): string {
    if (!fecha) return 'Sin fecha';
    const valor = new Date(fecha);
    if (isNaN(valor.getTime())) return fecha;
    return valor.toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });
  }

  /**
   * Recorta el código traducido a sus primeras líneas para la vista previa de la tarjeta.
   * @param codigo Texto completo del código.
   * @param lineas Cantidad máxima de líneas a mostrar (por defecto 6).
   * @returns Fragmento recortado con puntos suspensivos si excede el límite.
   */
  vistaPrevia(codigo: string | null | undefined, lineas = 6): string {
    if (!codigo) return '(sin código)';
    const partes = codigo.split('\n');
    const recorte = partes.slice(0, lineas).join('\n');
    return partes.length > lineas ? `${recorte}\n…` : recorte;
  }

  /**
   * Construye las opciones de lenguaje para el formulario, asegurando que el valor
   * actual aparezca disponible aunque no pertenezca al catálogo predefinido.
   * @param actual Código del lenguaje actualmente asignado.
   * @returns Lista de opciones para el `<select>`.
   */
  opcionesLenguaje(actual: string): Opcion[] {
    if (!actual || this.lenguajes.some((l) => l.valor === actual)) {
      return this.lenguajes;
    }
    return [{ valor: actual, etiqueta: actual }, ...this.lenguajes];
  }

  // ---------- Modificar ----------

  /**
   * Precarga los datos de la traducción seleccionada y abre el modal de edición.
   * @param t Registro del historial a modificar.
   */
  abrirEdicion(t: TraduccionHistorial): void {
    this.formulario = {
      codigoOriginal: t.codigoOriginal ?? '',
      codigoTraducido: t.codigoTraducido ?? '',
      lenguajeOrigen: t.lenguajeOrigen?.toUpperCase() ?? '',
      lenguajeDestino: t.lenguajeDestino?.toUpperCase() ?? '',
    };
    this.traduccionEditando.set(t);
  }

  /**
   * Cierra el modal de edición si no hay una operación de guardado en curso.
   */
  cerrarEdicion(): void {
    if (this.guardando) return;
    this.traduccionEditando.set(null);
  }

  /**
   * Valida el formulario, guarda los cambios en el backend y actualiza la lista local.
   * @param form Referencia al formulario template-driven de edición.
   */
  guardarCambios(form: NgForm): void {
    const traduccion = this.traduccionEditando();
    if (!traduccion || this.guardando) return;

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const datos: TraduccionHistorialActualizacion = { ...this.formulario };

    this.guardando = true;
    this.historialService
      .actualizar(traduccion.id, datos)
      .pipe(finalize(() => (this.guardando = false)))
      .subscribe({
        next: () => {
          this.traducciones.update((lista) =>
            lista.map((t) => (t.id === traduccion.id ? { ...t, ...datos } : t))
          );
          this.traduccionEditando.set(null);
          this.mostrarMensaje('Traducción actualizada correctamente.', 'exito');
        },
        error: (error: HttpErrorResponse) => {
          this.mostrarMensaje(this.obtenerMensajeError(error, 'No fue posible actualizar la traducción.'), 'error');
        },
      });
  }

  // ---------- Eliminar ----------

  /**
   * Abre el modal de confirmación para eliminar una traducción.
   * @param t Registro seleccionado para eliminación.
   */
  pedirConfirmacionEliminar(t: TraduccionHistorial): void {
    this.traduccionAEliminar.set(t);
  }

  /**
   * Cierra el modal de confirmación si no hay una eliminación en progreso.
   */
  cancelarEliminar(): void {
    if (this.eliminando) return;
    this.traduccionAEliminar.set(null);
  }

  /**
   * Elimina la traducción seleccionada en el backend y la remueve del estado local.
   */
  confirmarEliminar(): void {
    const traduccion = this.traduccionAEliminar();
    if (!traduccion || this.eliminando) return;

    this.eliminando = true;
    this.historialService
      .eliminar(traduccion.id)
      .pipe(finalize(() => (this.eliminando = false)))
      .subscribe({
        next: () => {
          this.traducciones.update((lista) => lista.filter((t) => t.id !== traduccion.id));
          this.traduccionAEliminar.set(null);
          this.mostrarMensaje('Traducción eliminada correctamente.', 'exito');
        },
        error: (error: HttpErrorResponse) => {
          this.mostrarMensaje(this.obtenerMensajeError(error, 'No fue posible eliminar la traducción.'), 'error');
        },
      });
  }

  /**
   * Cierra cualquier modal abierto al presionar la tecla Escape.
   */
  @HostListener('document:keydown.escape')
  cerrarVentanas(): void {
    this.cerrarEdicion();
    this.cancelarEliminar();
  }

  // ---------- Utilidades ----------

  /**
   * Traduce una respuesta de error HTTP a un mensaje legible para el usuario.
   * @param error Error HTTP recibido del servidor.
   * @param porDefecto Mensaje de respaldo cuando no hay detalle específico.
   * @returns Texto descriptivo del error.
   */
  private obtenerMensajeError(error: HttpErrorResponse, porDefecto: string): string {
    if (error.status === 0) {
      return 'No hay conexión con el servidor.';
    }
    if (error.status === 401 || error.status === 403) {
      return 'Tu sesión expiró. Inicia sesión de nuevo.';
    }
    if (typeof error.error === 'string' && error.error.trim()) {
      return error.error;
    }
    return porDefecto;
  }

  /**
   * Muestra una notificación temporal en la esquina superior derecha.
   * @param mensaje Texto a presentar.
   * @param tipo Define el estilo visual (`'exito'` o `'error'`).
   */
  private mostrarMensaje(mensaje: string, tipo: 'exito' | 'error'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: tipo === 'exito' ? ['snack-exito'] : ['snack-error'],
    });
  }
>>>>>>> Stashed changes
}
