package co.edu.unbosque.hermes.dto;

import java.time.LocalDateTime;

/**
 * Traducción vista desde el panel de administración: incluye los datos del
 * usuario que la realizó, pero no el código, que es información privada del
 * usuario.
 */
public class SolicitudAdminDTO {

	private Long id;
	/** Nombre de usuario (descifrado) de quien hizo la traducción. */
	private String usuario;
	/** Correo (descifrado) de quien hizo la traducción. */
	private String correo;
	private String lenguajeOrigen;
	private String lenguajeDestino;
	private String modelo;
	private LocalDateTime fecha;

	/**
	 * Constructor vacío.
	 */
	public SolicitudAdminDTO() {
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
	 */
	public SolicitudAdminDTO(Long id, String usuario, String correo, String lenguajeOrigen, String lenguajeDestino,
			String modelo, LocalDateTime fecha) {
		this.id = id;
		this.usuario = usuario;
		this.correo = correo;
		this.lenguajeOrigen = lenguajeOrigen;
		this.lenguajeDestino = lenguajeDestino;
		this.modelo = modelo;
		this.fecha = fecha;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUsuario() {
		return usuario;
	}

	public void setUsuario(String usuario) {
		this.usuario = usuario;
	}

	public String getCorreo() {
		return correo;
	}

	public void setCorreo(String correo) {
		this.correo = correo;
	}

	public String getLenguajeOrigen() {
		return lenguajeOrigen;
	}

	public void setLenguajeOrigen(String lenguajeOrigen) {
		this.lenguajeOrigen = lenguajeOrigen;
	}

	public String getLenguajeDestino() {
		return lenguajeDestino;
	}

	public void setLenguajeDestino(String lenguajeDestino) {
		this.lenguajeDestino = lenguajeDestino;
	}

	public String getModelo() {
		return modelo;
	}

	public void setModelo(String modelo) {
		this.modelo = modelo;
	}

	public LocalDateTime getFecha() {
		return fecha;
	}

	public void setFecha(LocalDateTime fecha) {
		this.fecha = fecha;
	}
}
