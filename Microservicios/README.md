# Pictorial Arcane — Microservicios

## Requisitos previos

- Java 21
- Maven (o usar el `mvnw` incluido)
- Docker Desktop

---

## 1. Levantar la base de datos

Desde la raíz del repositorio (`backend-microservices/`):

**Linux / Mac**
```bash
docker compose up -d
```

**Windows (PowerShell o CMD)**
```cmd
docker compose up -d
```

---

## 2. Variables de entorno

Las siguientes variables tienen valores por defecto que coinciden con el `docker-compose.yaml` del proyecto. Solo es obligatorio definir `GMAIL_PASSWORD` si se van a usar los endpoints que envían correos.

| Variable | Por defecto | Descripción |
|---|---|---|
| `DB_URL` | `jdbc:postgresql://localhost:5432/pictorial_arcane_db` | URL de conexión a PostgreSQL |
| `DB_USER` | `uneg` | Usuario de la BD |
| `DB_PASSWORD` | `uneg2026` | Contraseña de la BD |
| `HIBERNATE_MODE` | `update` | Modo DDL de Hibernate |
| `GMAIL_PASSWORD` | *(vacío)* | Contraseña de aplicación de Gmail |
| `DOCKER_CONF` | `false` | Control de Docker Compose automático |

**Linux / Mac**
```bash
export GMAIL_PASSWORD=tu_contraseña_de_app_gmail
```

**Windows (PowerShell)**
```powershell
$env:GMAIL_PASSWORD="tu_contraseña_de_app_gmail"
```

**Windows (CMD)**
```cmd
set GMAIL_PASSWORD=tu_contraseña_de_app_gmail
```

---

## 3. Orden de arranque

Los servicios deben iniciarse en este orden. Esperar a que cada uno esté completamente activo antes de iniciar el siguiente.

| # | Servicio | Puerto | Directorio |
|---|---|---|---|
| 1 | service-registry | 8761 | `service-registry/` |
| 2 | config-server | 8088 | `config-server/` |
| 3 | core-service | 8082 | `core-service/` |
| 4 | api-gateway | 8060 | `api-gateway/` |

---

## 4. Iniciar cada servicio

### Linux / Mac
```bash
cd service-registry && ./mvnw spring-boot:run
```

### Windows (PowerShell o CMD)
```cmd
cd service-registry && mvnw.cmd spring-boot:run
```

Repetir el mismo comando para cada servicio en el orden indicado, cada uno en una terminal diferente.

---

## 5. Verificar que todo está activo

Eureka Dashboard — lista todos los servicios registrados:
```
http://localhost:8761
```

Swagger del core-service — documentación de todos los endpoints:
```
http://localhost:8082/swagger-ui/index.html
```

---

## 6. Consumir los endpoints

Todos los endpoints del core-service están disponibles a través del API Gateway con el prefijo `/core/`:

```
POST http://localhost:8060/core/auth/register
POST http://localhost:8060/core/auth/login
GET  http://localhost:8060/core/user/profile
...
```
