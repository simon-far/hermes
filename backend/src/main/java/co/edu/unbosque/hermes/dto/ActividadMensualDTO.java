package co.edu.unbosque.hermes.dto;

/**
 * Cantidad de usuarios registrados y de traducciones realizadas durante un mes.
 * Se usa para las gráficas de actividad del panel de administración.
 */
public class ActividadMensualDTO {

	/** Mes en formato {@code yyyy-MM} (por ejemplo, {@code 2026-11}). */
	private String periodo;

	/** Usuarios registrados durante el mes. */
	private long usuarios;

	/** Traducciones realizadas durante el mes. */
	private long traducciones;

	/**
	 * Constructor vacío.
	 */
	public ActividadMensualDTO() {
		// Constructor por defecto requerido para la serialización
	}

	/**
	 * Constructor con todos los campos.
	 *
	 * @param periodo      Mes en formato {@code yyyy-MM}.
	 * @param usuarios     Usuarios registrados durante el mes.
	 * @param traducciones Traducciones realizadas durante el mes.
	 */
	public ActividadMensualDTO(String periodo, long usuarios, long traducciones) {
		this.periodo = periodo;
		this.usuarios = usuarios;
		this.traducciones = traducciones;
	}

	public String getPeriodo() {
		return periodo;
	}

	public void setPeriodo(String periodo) {
		this.periodo = periodo;
	}

	public long getUsuarios() {
		return usuarios;
	}

	public void setUsuarios(long usuarios) {
		this.usuarios = usuarios;
	}

	public long getTraducciones() {
		return traducciones;
	}

	public void setTraducciones(long traducciones) {
		this.traducciones = traducciones;
	}
}
