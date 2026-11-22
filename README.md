# CodeTranslate
# Hermes

**Hermes** es una aplicación web para traducir código fuente entre lenguajes de programación usando modelos de inteligencia artificial. El usuario pega su código, elige el lenguaje de destino y recibe el código traducido junto con una lista de mejoras sugeridas. Cada traducción queda guardada en un historial personal, y los administradores cuentan con un panel para gestionar usuarios y revisar estadísticas de uso.

## Integrantes

| Nombre | Correo |

| Cesar cardenas| cdcardenasp@unbosque.edu.co|
| Julio Rondón | jrondonc@unbosque.edu.co |
| Kevin Puentes | Kpuentess@unbosque.edu.co |
| Nicolás Alberto Mahecha | nmahechaa@unbosque.edu.co |
| Simón Farfán | sfarfan@unbosque.edu.co |

## Características

- **Traducción de código** entre Java, Python, JavaScript, TypeScript, C++ y C#.
- **Detección automática** del lenguaje de origen cuando no se indica.
- **Sugerencias de mejora** (hasta 6) sobre el código traducido.
- **Tres modelos de IA** disponibles a través de [OpenRouter](https://openrouter.ai):
  - `cohere/north-mini-code:free`
  - `nvidia/nemotron-3-ultra-550b-a55b:free`
  - `particle-ai/particle-1:free`
- **Editor de código** con resaltado de sintaxis.
- **Historial de traducciones** por usuario, con edición y eliminación.
- **Envío del resultado por correo** al email con el que se registró el usuario.
- **Autenticación con JWT** (validez de 24 horas) y control de acceso por rol (`USER` / `ADMIN`).
- **Datos sensibles cifrados**: usuario y correo se almacenan con AES/GCM; las contraseñas con el codificador de Spring Security; el historial se guarda cifrado.
- **Panel de administración**: gestión de usuarios, listado de solicitudes, estadísticas y reportes.
- **Documentación de la API** con Swagger UI.

## Arquitectura

```
hermes/
├── backend/    API REST (Spring Boot, Java 21, Maven)
└── frontend/   Aplicación de una sola página (Angular)
```

El frontend se comunica con el backend por HTTP (`http://localhost:8080`) enviando el token JWT en el encabezado `Authorization: Bearer <token>`. El backend persiste los datos en MySQL y delega la traducción a OpenRouter.

### Tecnologías

**Backend**

- Java 21 y Spring Boot 4.1
- Spring Web MVC, Spring Data JPA, Spring Security, Spring Validation y Spring Mail
- MySQL
- JJWT, ModelMapper, Gson y Commons Codec
- SpringDoc OpenAPI

**Frontend**

- Angular 22 y Angular Material
- CodeMirror 6
- Font Awesome
- RxJS, Vitest

## Requisitos previos

- JDK 21
- Node.js y npm 
- MySQL en ejecución
- Una cuenta de OpenRouter con claves de API para los modelos usados

## Configuración del backend

El archivo `backend/src/main/resources/application.properties` está excluido del repositorio (`.gitignore`) porque contiene secretos. Es necesario crearlo con el siguiente contenido, o bien definir esas mismas propiedades como variables de entorno (que tienen prioridad):


## Ejecución

### 1. Backend

```bash
cd backend
./mvnw spring-boot:run
```

En Windows:

```bash
mvnw.cmd spring-boot:run
```

La API queda disponible en `http://localhost:8080`.

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

La aplicación queda disponible en `http://localhost:4200`. El backend solo acepta peticiones CORS desde ese origen.

### Usuarios precargados

Al iniciar por primera vez, el backend crea dos cuentas de prueba:

| Rol | Usuario | Contraseña |
| --- | --- | --- |
| Administrador | `admin` | `12345678` |
| Usuario | `normaluser` | `1234567890` |

Cambia o elimina estas credenciales antes de cualquier despliegue real.

## Rutas del frontend

| Ruta | Descripción | Acceso |
| --- | --- | --- |
| `/usuario/traductor` | Traductor de código | Usuario autenticado |
| `/usuario/historial` | Historial de traducciones | Usuario autenticado |
| `/admin/principaladmin` | Panel principal del administrador | `ADMIN` |
| `/admin/usuarios` | Gestión de usuarios | `ADMIN` |
| `/admin/solicitudes` | Solicitudes de traducción | `ADMIN` |
| `/admin/reportes` | Reportes y estadísticas | `ADMIN` |

## API REST

La documentación interactiva está en `http://localhost:8080/swagger-ui/index.html`.

| Método | Endpoint | Descripción | Acceso |
| --- | --- | --- | --- |
| POST | `/auth/login` | Inicia sesión y devuelve el token JWT y el rol | Público |
| POST | `/auth/register` | Registra un nuevo usuario (rol `USER`) | Público |
| POST | `/cohere/traduccion` | Traduce código con Cohere | `USER`, `ADMIN` |
| POST | `/nemotron/traduccion` | Traduce código con Nemotron | `USER`, `ADMIN` |
| POST | `/particle/traduccion` | Traduce código con Particle-1 | `USER`, `ADMIN` |
| GET | `/historial` | Lista el historial del usuario | Autenticado |
| PUT | `/historial/actualizar/{id}` | Actualiza una traducción del historial | Autenticado |
| DELETE | `/historial/eliminar/{id}` | Elimina una traducción del historial | Autenticado |
| POST | `/correo/enviar` | Envía un mensaje al correo del usuario autenticado | Autenticado |
| GET | `/user/getall` | Lista los usuarios | `ADMIN` |
| POST | `/user/createjson` | Crea un usuario | `ADMIN` |
| POST | `/user/updateuser/{id}` | Actualiza un usuario | `ADMIN` |
| DELETE | `/user/deletebyid/{id}` | Elimina un usuario | `ADMIN` |
| GET | `/estadisticas` | Estadísticas generales | `ADMIN` |
| GET | `/estadisticas/solicitudes` | Todas las solicitudes de traducción | `ADMIN` |


## Estructura del backend

```
backend/src/main/java/co/edu/unbosque/hermes/
├── configuration/   Carga inicial de datos y configuración de OpenAPI
├── controller/      Controladores REST
├── dto/             Objetos de transferencia de datos
├── entity/          Entidades JPA (Usuario, Traduccion)
├── exception/       Manejo global de errores
├── repository/      Repositorios Spring Data
├── security/        JWT, filtro de autenticación y configuración de seguridad
├── service/         Lógica de negocio y cliente HTTP hacia OpenRouter
└── util/            Utilidades de cifrado (AES)
```

## Pruebas y documentación

```bash
# Pruebas del frontend
cd frontend
npm test

# Pruebas del backend
cd backend
./mvnw test

# Javadoc del backend
./mvnw javadoc:javadoc
```
