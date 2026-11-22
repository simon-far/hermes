package co.edu.unbosque.hermes.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Detalle completo de una traducción para el panel de administración: además
 * de los datos de {@link SolicitudAdminDTO}, incluye el código original, el
 * código traducido y las mejoras sugeridas por la IA.
 */
public class SolicitudDetalleDTO extends SolicitudAdminDTO {

	/** Código fuente enviado por el usuario (descifrado). */
	private String codigoOriginal;

	/** Código resultante de la traducción (descifrado). */
	private String codigoTraducido;

	/** Mejoras sugeridas por la IA, una por elemento. */
	private List<String> mejoras;

	/**
	 * Constructor vacío.
	 */
	public SolicitudDetalleDTO() {
		// Constructor por defecto requerido para la serialización
	}

	/**
	 * Constructor con todos los campos.
	 *
	 * @param id              Identificador de la traducción.
	 * @param usuario         Nombre de usuario descifrado.
	 * @param correo          Correo descifrado.
	 * @param lenguajeOrigen  Lenguaje de origen.
	 * @param lenguajeDestino Lenguaje de destino.
	 * @param modelo          Modelo de IA utilizado.
	 * @param fecha           Fecha y hora de la traducción.
	 * @param codigoOriginal  Código original descifrado.
	 * @param codigoTraducido Código traducido descifrado.
	 * @param mejoras         Mejoras sugeridas por la IA.
	 */
	public SolicitudDetalleDTO(Long id, String usuario, String correo, String lenguajeOrigen, String lenguajeDestino,
			String modelo, LocalDateTime fecha, String codigoOriginal, String codigoTraducido, List<String> mejoras) {
		super(id, usuario, correo, lenguajeOrigen, lenguajeDestino, modelo, fecha);
		this.codigoOriginal = codigoOriginal;
		this.codigoTraducido = codigoTraducido;
		this.mejoras = mejoras;
	}

	public String getCodigoOriginal() {
		return codigoOriginal;
	}

	public void setCodigoOriginal(String codigoOriginal) {
		this.codigoOriginal = codigoOriginal;
	}

	public String getCodigoTraducido() {
		return codigoTraducido;
	}

	public void setCodigoTraducido(String codigoTraducido) {
		this.codigoTraducido = codigoTraducido;
	}

	public List<String> getMejoras() {
		return mejoras;
	}

	public void setMejoras(List<String> mejoras) {
		this.mejoras = mejoras;
	}
}
