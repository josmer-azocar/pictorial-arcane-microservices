# Pictorial Arcane — Microservicios

## Arquitectura

| Servicio | Puerto | Rol | Base de datos |
|---|---|---|---|
| service-registry | 8761 | Descubrimiento (Eureka Server) | — |
| config-server | 8088 | Configuración centralizada | — |
| api-gateway | 8060 | Puerta de entrada / enrutamiento | — |
| core-service | 8082 | Usuarios, clientes, ventas, membresías, pagos, auth/JWT | PostgreSQL |
| artwork-service | 8070 | Catálogo de obras, artistas y géneros | MongoDB |
| audit-service | 8071 | Auditoría: facturación, historial de obras, logs de seguridad | Cassandra (Astra DB) |

Los tres servicios de negocio se registran en Eureka y son alcanzables tanto a través del
API Gateway (tráfico externo) como directamente por nombre lógico `lb://<servicio>` (tráfico
interno entre servicios).

---

## Requisitos previos

- Java 21
- Maven (o usar el `mvnw` incluido)
- Docker Desktop (para la base de datos PostgreSQL local)

---

## 1. Levantar la base de datos relacional (core-service)

Desde la raíz del repositorio (`backend-microservices/`):

```bash
docker compose up -d
```

> MongoDB (artwork-service) y Cassandra/Astra (audit-service) usan instancias en la nube
> configuradas en sus respectivos `application.properties`.

---

## 2. Variables de entorno

Valores por defecto que coinciden con el `docker-compose.yaml`. Solo es obligatorio definir
`GMAIL_PASSWORD` si se usan los endpoints que envían correos.

| Variable | Por defecto | Descripción |
|---|---|---|
| `DB_URL` | `jdbc:postgresql://localhost:5432/pictorial_arcane_db` | URL de conexión a PostgreSQL |
| `DB_USER` | `uneg` | Usuario de la BD |
| `DB_PASSWORD` | `uneg2026` | Contraseña de la BD |
| `HIBERNATE_MODE` | `update` | Modo DDL de Hibernate |
| `GMAIL_PASSWORD` | *(vacío)* | Contraseña de aplicación de Gmail |
| `DOCKER_CONF` | `false` | Control de Docker Compose automático |

```bash
export GMAIL_PASSWORD=tu_contraseña_de_app_gmail
```

> Nota: artwork-service (MongoDB Atlas) y audit-service (Astra DB) traen credenciales
> embebidas en sus `application.properties`. Para producción conviene externalizarlas a
> variables de entorno, igual que hace core-service con `DB_*`.

---

## 3. Orden de arranque

Iniciar en este orden, esperando a que cada uno esté activo antes del siguiente.
Los servicios de negocio (3, 4 y 5) pueden iniciarse en cualquier orden entre ellos.

| # | Servicio | Puerto | Directorio |
|---|---|---|---|
| 1 | service-registry | 8761 | `service-registry/` |
| 2 | config-server | 8088 | `config-server/` |
| 3 | core-service | 8082 | `core-service/` |
| 4 | artwork-service | 8070 | `artwork-service/` |
| 5 | audit-service | 8071 | `audit-service/` |
| 6 | api-gateway | 8060 | `api-gateway/` |

```bash
cd service-registry && ./mvnw spring-boot:run
```

Repetir para cada servicio en una terminal distinta. En Windows usar `mvnw.cmd`.

---

## 4. Verificar que todo está activo

- **Eureka Dashboard** (servicios registrados): http://localhost:8761
- **Swagger del core-service**: http://localhost:8082/swagger-ui/index.html

---

## 5. Rutas del API Gateway

Todo el tráfico externo entra por `http://localhost:8060`.

| Prefijo | Servicio destino | Notas |
|---|---|---|
| `/core/**` | core-service | Se elimina el prefijo (`StripPrefix=1`) antes de reenviar |
| `/artist/**`, `/artwork/**`, `/genre/**` | artwork-service | Se reenvía tal cual |
| `/artwork-status-history/**`, `/billing-by-month/**`, `/security-log-by-event/**` | audit-service | Se reenvía tal cual |

Ejemplos:

```
POST http://localhost:8060/core/auth/register
POST http://localhost:8060/core/auth/login
GET  http://localhost:8060/artwork/all
GET  http://localhost:8060/billing-by-month/all
```

---

## 6. Comunicación entre servicios

La comunicación interna se hace por descubrimiento Eureka con `RestClient` balanceado
(`lb://`), sin pasar por el gateway.

### Identificador de obra compartido

El catálogo de obras vive en MongoDB (artwork-service), cuyo `_id` es un `String`
(ObjectId). Para integrarse con core-service y audit-service —que modelan el id de obra
como `Long`— artwork-service expone además una **clave de negocio numérica** `artworkId`
(`Long`), generada por un contador en Mongo (`SequenceGeneratorService`). Esa clave es la
que se intercambia entre servicios.

### Flujos implementados

Todas las llamadas que **auditan o liberan** son *best-effort* (un fallo se registra en el
log y no revierte la operación principal). La **reserva** sí es bloqueante: si la obra no
puede reservarse, la venta no se crea.

| Origen → Destino | Disparador | Efecto | Tipo |
|---|---|---|---|
| core → artwork | reservar (`reserveArtWork`) | `AVAILABLE → RESERVED` | **bloqueante** |
| core → artwork | confirmar venta (`confirmSale`) | `RESERVED → SOLD` | best-effort |
| core → artwork | rechazar venta / expiración 24 h | `RESERVED → AVAILABLE` | best-effort |
| artwork → audit | cada cambio de estado | escribe `artwork_status_history` | best-effort |
| core → audit | confirmar/facturar venta | escribe `billing_by_month` | best-effort |
| core → audit | login exitoso | escribe `security_log_by_event` | best-effort |

Endpoints de transición que expone artwork-service (consumidos por core vía `artworkId`):

```
POST /artwork/reserve/{artworkId}?changedBy={dni}
POST /artwork/sell/{artworkId}?changedBy={dni}
POST /artwork/release/{artworkId}?changedBy={dni}
```

### Limitaciones / mejoras futuras

- **Consistencia distribuida (saga).** La reserva escribe en dos sistemas sin transacción
  global: primero reserva la obra en artwork-service (Mongo) y luego crea la venta en
  core-service (PostgreSQL). Si el segundo paso falla justo después de reservar, la obra
  queda `RESERVED` sin venta asociada (y el job de expiración de 24 h no la libera porque no
  hay venta `PENDING`). Solución recomendada: patrón **outbox + mensajería** (Kafka/RabbitMQ)
  con eventos `ArtworkReserved` / `SaleCreated` y compensaciones, o un timeout de reserva
  propio en artwork-service. Por ahora se asume que el fallo entre ambos pasos es improbable.
- **Auditoría síncrona.** Hoy core/artwork llaman a audit-service por HTTP *best-effort*; si
  audit está caído se pierde ese registro. Migrar la auditoría a eventos asíncronos la haría
  garantizada y desacoplada.

---

## 7. Datos de prueba (core-service)

El archivo `core-service/src/main/resources/data.sql` precarga una base relacional tipo
"legacy" con historial 2015–2026 (cientos de usuarios, clientes, ventas, pagos y membresías).
Se carga automáticamente al arrancar (`spring.jpa.defer-datasource-initialization=true`).

| Credencial | Valor |
|---|---|
| Contraseña de todos los usuarios (login) | `Test1234` |
| Código de seguridad de todos los clientes (reservas) | `123456` |
| Admin de ejemplo | `admin@pictorialarcane.com` |
| Cliente de ejemplo | `maria.gonzalez@mail.com` |

Tanto la contraseña como el código de seguridad se almacenan bcrypteados, igual que en el
flujo real (`ClientService.createSecurityCode`).

---

## 8. Datos de prueba (artwork-service y audit-service)

A diferencia del relacional, estos seeds **no se cargan automáticamente**; se ejecutan a mano
contra las BD en la nube. Ambos son **consistentes con `data.sql`**: el `artworkId` de Mongo,
el `id_artwork` de las ventas y el `artwork_id` de Cassandra son el mismo valor, y el estado
de cada obra se deriva del `sale_status`.

### MongoDB — `artwork-service/scripts/mongo-seed.js`

Crea 10 géneros, 80 artistas y **1000 obras** (`artworkId` 1–1000), e inicializa el contador
`db_sequences` en 1000 (las obras nuevas seguirán en 1001). Limpia las colecciones antes de
insertar (idempotente).

Estado de las obras, derivado de las ventas del `data.sql`:

| Estado | Cantidad | Origen |
|---|---|---|
| `SOLD` | 337 | obras de ventas `APPROVED` |
| `RESERVED` | 164 | obras de ventas `PENDING` |
| `AVAILABLE` | 499 | 99 de ventas `CANCELED` (liberadas) + 400 sin venta |

```bash
mongosh "mongodb+srv://<usuario>:<clave>@<cluster>/pictorial-arcane" artwork-service/scripts/mongo-seed.js
```

### Cassandra (Astra) — `audit-service/scripts/cassandra-seed.cql`

Incluye los `CREATE TABLE IF NOT EXISTS` (el servicio usa `schema-action=none`) y los datos:

| Tabla | Filas | Contenido |
|---|---|---|
| `billing_by_month` | 337 | una por venta `APPROVED`, con sus montos exactos |
| `artwork_status_history` | 1036 | transiciones de estado por venta (reserva / venta / liberación) |
| `security_log_by_event` | 287 | inicios de sesión de admins y una muestra de clientes |

```bash
cqlsh -k pictorial_arcane -f audit-service/scripts/cassandra-seed.cql
# o pegar el contenido en la consola CQL de Astra DB
```

> Los scripts se generaron parseando `data.sql`, de modo que `changed_by`, `client_dni`,
> `admin_dni`, fechas y montos coinciden con las ventas y usuarios reales del seed relacional.
