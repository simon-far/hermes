package co.edu.unbosque.hermes.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import co.edu.unbosque.hermes.dto.EstadisticasDTO;
import co.edu.unbosque.hermes.dto.SolicitudAdminDTO;
import co.edu.unbosque.hermes.dto.SolicitudDetalleDTO;
import co.edu.unbosque.hermes.service.EstadisticasService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * Controlador REST que expone los endpoints para consultar las estadísticas de
 * uso y registros de la plataforma Hermes. Solo accesible para administradores
 * (ver {@code SecurityConfig}).
 */
@RestController
@RequestMapping("/estadisticas")
@Tag(name = "Estadísticas", description = "Endpoints para métricas de usuarios y uso de traducciones")
@SecurityRequirement(name = "bearerAuth")
public class EstadisticasController {

	/** Servicio de negocio para el cálculo de estadísticas. */
	private final EstadisticasService estadisticaServ;

	/**
	 * Constructor que inyecta el servicio de estadísticas.
	 *
	 * @param estadisticaServ Servicio de estadísticas.
	 */
	public EstadisticasController(EstadisticasService estadisticaServ) {
		this.estadisticaServ = estadisticaServ;
	}

	@Operation(summary = "Obtener estadísticas generales", description = "Devuelve el total de usuarios y traducciones, el desglose por lenguaje de destino, la actividad de los últimos 6 meses y las últimas traducciones.")
	@GetMapping
	public ResponseEntity<EstadisticasDTO> obtenerEstadisticas() {
		return ResponseEntity.ok(estadisticaServ.obtenerEstadisticas());
	}

	@Operation(summary = "Listar todas las solicitudes", description = "Devuelve todas las traducciones con el usuario que las realizó, de la más reciente a la más antigua. No incluye el código.")
	@GetMapping("/solicitudes")
	public ResponseEntity<List<SolicitudAdminDTO>> obtenerSolicitudes() {
		return ResponseEntity.ok(estadisticaServ.obtenerSolicitudes());
	}

	@Operation(summary = "Detalle de una solicitud", description = "Devuelve una traducción con su usuario, el código original, el código traducido y las mejoras sugeridas por la IA.")
	@GetMapping("/solicitudes/{id}")
	public ResponseEntity<SolicitudDetalleDTO> obtenerDetalleSolicitud(@PathVariable Long id) {
		return estadisticaServ.obtenerDetalleSolicitud(id).map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.notFound().build());
	}
}
