package co.edu.unbosque.hermes.dto;

import java.util.List;
import java.util.Map;

/**
 * Métricas generales de la plataforma que se muestran en el panel de
 * administración.
 */
public class EstadisticasDTO {

	/** Cantidad total de usuarios registrados en el sistema. */
	private long totalUsuarios;

	/** Cantidad total de registros de traducción almacenados. */
	private long totalTraducciones;

	/**
	 * Mapa con el conteo de traducciones agrupadas por lenguaje de destino
	 * (clave: lenguaje, valor: cantidad).
	 */
	private Map<String, Long> traduccionesPorLenguaje;

	/** Usuarios y traducciones de los últimos meses, del más antiguo al actual. */
	private List<ActividadMensualDTO> actividadMensual;

	/** Últimas traducciones realizadas, de la más reciente a la más antigua. */
	private List<SolicitudAdminDTO> ultimasSolicitudes;

	/**
	 * Constructor vacio
	 */
	public EstadisticasDTO() {
		// Constructor por defecto requerido para la serialización
	}

	/**
	 * Constructor con todos los campos.
	 *
	 * @param totalUsuarios           Cantidad total de usuarios.
	 * @param totalTraducciones       Cantidad total de traducciones.
	 * @param traduccionesPorLenguaje Conteo agrupado por lenguaje de destino.
	 * @param actividadMensual        Actividad de los últimos meses.
	 * @param ultimasSolicitudes      Últimas traducciones realizadas.
	 */
	public EstadisticasDTO(long totalUsuarios, long totalTraducciones, Map<String, Long> traduccionesPorLenguaje,
			List<ActividadMensualDTO> actividadMensual, List<SolicitudAdminDTO> ultimasSolicitudes) {
		this.totalUsuarios = totalUsuarios;
		this.totalTraducciones = totalTraducciones;
		this.traduccionesPorLenguaje = traduccionesPorLenguaje;
		this.actividadMensual = actividadMensual;
		this.ultimasSolicitudes = ultimasSolicitudes;
	}

	/**
	 * Obtiene el total de usuarios registrados.
	 *
	 * @return Número total de usuarios.
	 */
	public long getTotalUsuarios() {
		return totalUsuarios;
	}

	/**
	 * Establece el total de usuarios registrados.
	 *
	 * @param totalUsuarios Número total de usuarios.
	 */
	public void setTotalUsuarios(long totalUsuarios) {
		this.totalUsuarios = totalUsuarios;
	}

	/**
	 * Obtiene el total de traducciones registradas.
	 *
	 * @return Número total de traducciones.
	 */
	public long getTotalTraducciones() {
		return totalTraducciones;
	}

	/**
	 * Establece el total de traducciones registradas.
	 *
	 * @param totalTraducciones Número total de traducciones.
	 */
	public void setTotalTraducciones(long totalTraducciones) {
		this.totalTraducciones = totalTraducciones;
	}

	/**
	 * Obtiene el mapa de traducciones agrupadas por lenguaje de destino.
	 *
	 * @return Mapa con el nombre del lenguaje y su respectivo conteo.
	 */
	public Map<String, Long> getTraduccionesPorLenguaje() {
		return traduccionesPorLenguaje;
	}

	/**
	 * Establece el mapa de traducciones agrupadas por lenguaje de destino.
	 *
	 * @param traduccionesPorLenguaje Mapa de conteos por lenguaje.
	 */
	public void setTraduccionesPorLenguaje(Map<String, Long> traduccionesPorLenguaje) {
		this.traduccionesPorLenguaje = traduccionesPorLenguaje;
	}

	/**
	 * Obtiene la actividad de los últimos meses.
	 *
	 * @return Lista del mes más antiguo al actual.
	 */
	public List<ActividadMensualDTO> getActividadMensual() {
		return actividadMensual;
	}

	/**
	 * Establece la actividad de los últimos meses.
	 *
	 * @param actividadMensual Lista del mes más antiguo al actual.
	 */
	public void setActividadMensual(List<ActividadMensualDTO> actividadMensual) {
		this.actividadMensual = actividadMensual;
	}

	/**
	 * Obtiene las últimas traducciones realizadas.
	 *
	 * @return Lista de la más reciente a la más antigua.
	 */
	public List<SolicitudAdminDTO> getUltimasSolicitudes() {
		return ultimasSolicitudes;
	}

	/**
	 * Establece las últimas traducciones realizadas.
	 *
	 * @param ultimasSolicitudes Lista de la más reciente a la más antigua.
	 */
	public void setUltimasSolicitudes(List<SolicitudAdminDTO> ultimasSolicitudes) {
		this.ultimasSolicitudes = ultimasSolicitudes;
	}
}
