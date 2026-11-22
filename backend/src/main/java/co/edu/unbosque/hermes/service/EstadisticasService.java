package co.edu.unbosque.hermes.service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import co.edu.unbosque.hermes.dto.ActividadMensualDTO;
import co.edu.unbosque.hermes.dto.EstadisticasDTO;
import co.edu.unbosque.hermes.dto.SolicitudAdminDTO;
import co.edu.unbosque.hermes.dto.SolicitudDetalleDTO;
import co.edu.unbosque.hermes.entity.Traduccion;
import co.edu.unbosque.hermes.entity.Usuario;
import co.edu.unbosque.hermes.repository.TraduccionRepository;
import co.edu.unbosque.hermes.repository.UsuarioRepository;
import co.edu.unbosque.hermes.util.AESUtil;

/**
 * Calcula las métricas del panel de administración a partir de los usuarios y
 * las traducciones guardadas en la base de datos.
 */
@Service
public class EstadisticasService {

	/** Cantidad de meses (incluido el actual) que se muestran en las gráficas. */
	private static final int MESES_ACTIVIDAD = 6;

	/** Cantidad de traducciones que se muestran como actividad reciente. */
	private static final int CANTIDAD_ULTIMAS = 5;

	private final UsuarioRepository usuarioRepo;

	private final TraduccionRepository traduccionRepo;

	/**
	 * Único constructor: con un solo constructor Spring inyecta los repositorios.
	 * (Si existiera también un constructor vacío, Spring usaría ese y los
	 * repositorios quedarían en {@code null}).
	 *
	 * @param usuarioRepo    Repositorio de usuarios.
	 * @param traduccionRepo Repositorio de traducciones.
	 */
	public EstadisticasService(UsuarioRepository usuarioRepo, TraduccionRepository traduccionRepo) {
		this.usuarioRepo = usuarioRepo;
		this.traduccionRepo = traduccionRepo;
	}

	/**
	 * Calcula los totales, el conteo por lenguaje de destino, la actividad de los
	 * últimos meses y las últimas traducciones.
	 *
	 * @return Estadísticas generales de la plataforma.
	 */
	@Transactional(readOnly = true)
	public EstadisticasDTO obtenerEstadisticas() {
		List<Usuario> usuarios = usuarioRepo.findAll();
		List<Traduccion> traducciones = traduccionRepo.findAllConUsuarioOrderByFechaDesc();

		Map<String, Long> porLenguaje = new HashMap<>();
		for (Traduccion t : traducciones) {
			String lenguaje = t.getLenguajeDestino();
			if (lenguaje == null || lenguaje.isBlank()) {
				lenguaje = "sin especificar";
			}
			porLenguaje.merge(lenguaje, 1L, Long::sum);
		}

		List<SolicitudAdminDTO> ultimas = new ArrayList<>();
		for (int i = 0; i < Math.min(CANTIDAD_ULTIMAS, traducciones.size()); i++) {
			ultimas.add(aSolicitudAdmin(traducciones.get(i)));
		}

		return new EstadisticasDTO(usuarios.size(), traducciones.size(), porLenguaje,
				actividadMensual(usuarios, traducciones), ultimas);
	}

	/**
	 * Lista todas las traducciones con los datos (descifrados) de su usuario, de
	 * la más reciente a la más antigua.
	 *
	 * @return Lista de solicitudes para el panel de administración.
	 */
	@Transactional(readOnly = true)
	public List<SolicitudAdminDTO> obtenerSolicitudes() {
		List<SolicitudAdminDTO> lista = new ArrayList<>();
		traduccionRepo.findAllConUsuarioOrderByFechaDesc().forEach((t) -> lista.add(aSolicitudAdmin(t)));
		return lista;
	}

	/**
	 * Obtiene el detalle completo de una traducción, con el código original, el
	 * traducido y las mejoras sugeridas (todo descifrado).
	 *
	 * @param id Identificador de la traducción.
	 * @return El detalle, o vacío si la traducción no existe.
	 */
	@Transactional(readOnly = true)
	public Optional<SolicitudDetalleDTO> obtenerDetalleSolicitud(Long id) {
		return traduccionRepo.findById(id).map((t) -> {
			Usuario u = t.getUsuario();
			return new SolicitudDetalleDTO(t.getId(), descifrar(u.getUsername()), descifrar(u.getEmail()),
					t.getLenguajeOrigen(), t.getLenguajeDestino(), t.getModelo(), t.getFecha(),
					descifrar(t.getCodigoOriginal()), descifrar(t.getCodigoTraducido()), mejorasALista(t.getMejoras()));
		});
	}

	/**
	 * Convierte el texto de mejoras guardado en la base de datos en una lista. Las
	 * traducciones nuevas lo guardan con una mejora por línea; las antiguas pueden
	 * tenerlo como {@code "[mejora 1, mejora 2]"}, que se devuelve como un solo
	 * elemento para no partir frases que contengan comas.
	 */
	private static List<String> mejorasALista(String texto) {
		if (texto == null || texto.isBlank()) {
			return List.of();
		}
		String limpio = texto.strip();
		if (!limpio.contains("\n") && limpio.startsWith("[") && limpio.endsWith("]")) {
			limpio = limpio.substring(1, limpio.length() - 1).strip();
			return limpio.isEmpty() ? List.of() : List.of(limpio);
		}
		return limpio.lines().map(String::strip).filter((l) -> !l.isEmpty()).toList();
	}

	/**
	 * Cuenta usuarios registrados y traducciones por mes durante los últimos
	 * {@link #MESES_ACTIVIDAD} meses. Los registros sin fecha no se cuentan.
	 */
	private List<ActividadMensualDTO> actividadMensual(List<Usuario> usuarios, List<Traduccion> traducciones) {
		YearMonth actual = YearMonth.now();
		Map<YearMonth, long[]> conteo = new LinkedHashMap<>();
		for (int i = MESES_ACTIVIDAD - 1; i >= 0; i--) {
			// [0] = usuarios, [1] = traducciones
			conteo.put(actual.minusMonths(i), new long[2]);
		}

		for (Usuario u : usuarios) {
			sumar(conteo, u.getFechaRegistro(), 0);
		}
		for (Traduccion t : traducciones) {
			sumar(conteo, t.getFecha(), 1);
		}

		List<ActividadMensualDTO> lista = new ArrayList<>();
		conteo.forEach((mes, valores) -> lista.add(new ActividadMensualDTO(mes.toString(), valores[0], valores[1])));
		return lista;
	}

	private static void sumar(Map<YearMonth, long[]> conteo, LocalDateTime fecha, int posicion) {
		if (fecha == null) {
			return;
		}
		long[] valores = conteo.get(YearMonth.from(fecha));
		if (valores != null) {
			valores[posicion]++;
		}
	}

	/**
	 * Convierte una traducción en el DTO del panel. Se descifran los datos del
	 * usuario en el DTO, nunca en la entidad, para que Hibernate no guarde el
	 * texto plano en la base de datos.
	 */
	private static SolicitudAdminDTO aSolicitudAdmin(Traduccion t) {
		Usuario u = t.getUsuario();
		return new SolicitudAdminDTO(t.getId(), descifrar(u.getUsername()), descifrar(u.getEmail()),
				t.getLenguajeOrigen(), t.getLenguajeDestino(), t.getModelo(), t.getFecha());
	}

	private static String descifrar(String cifrado) {
		return cifrado == null ? null : AESUtil.decrypt(cifrado);
	}
}
