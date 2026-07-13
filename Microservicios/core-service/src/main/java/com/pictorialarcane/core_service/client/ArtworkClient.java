package com.pictorialarcane.core_service.client;

import com.pictorialarcane.core_service.client.dto.ArtworkReservationResponse;
import com.pictorialarcane.core_service.domain.exception.ArtworkNotAvailableException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.loadbalancer.LoadBalancerClient;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

/**
 * Cliente síncrono hacia el artwork-service. La obra se referencia por su clave de negocio
 * numérica (artworkId Long). La instancia se resuelve por Eureka con LoadBalancerClient.
 *
 * - reserve(): NO best-effort; si falla, propaga la excepción para abortar la venta.
 * - markSold()/release(): best-effort; no revierten operaciones ya consolidadas.
 */
@Component
public class ArtworkClient {

    private static final Logger log = LoggerFactory.getLogger(ArtworkClient.class);
    private static final String SERVICE_ID = "artwork-service";
    private static final long SYSTEM_ACTOR = 0L; // actor "sistema" para acciones automáticas

    private final RestClient restClient = RestClient.create();
    private final LoadBalancerClient loadBalancer;

    public ArtworkClient(LoadBalancerClient loadBalancer) {
        this.loadBalancer = loadBalancer;
    }

    private String baseUrl() {
        ServiceInstance instance = loadBalancer.choose(SERVICE_ID);
        if (instance == null) {
            throw new IllegalStateException("No hay instancias de " + SERVICE_ID + " en Eureka");
        }
        return instance.getUri().toString();
    }

    /**
     * AVAILABLE -> RESERVED. Lanza ArtworkNotAvailableException si no es posible.
     * Devuelve el nombre de la obra tomado de la respuesta de artwork-service, que ya lo
     * incluye en el body: evita una llamada adicional solo para obtenerlo.
     */
    public String reserve(Long artworkId, Long changedBy) {
        try {
            ArtworkReservationResponse response = restClient.post()
                    .uri(baseUrl() + "/artwork/reserve/{id}?changedBy={cb}&reason={r}", artworkId, changedBy, "Reserva de venta")
                    .retrieve()
                    .body(ArtworkReservationResponse.class);
            return response != null ? response.name() : null;
        } catch (Exception e) {
            throw new ArtworkNotAvailableException(
                    "No se pudo reservar la obra " + artworkId + " en artwork-service: " + e.getMessage());
        }
    }

    /** RESERVED -> SOLD. Best-effort. changedBy null = acción automática del sistema. */
    public void markSold(Long artworkId, Long changedBy) {
        long actor = changedBy != null ? changedBy : SYSTEM_ACTOR;
        try {
            restClient.post()
                    .uri(baseUrl() + "/artwork/sell/{id}?changedBy={cb}&reason={r}", artworkId, actor, "Venta confirmada")
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception e) {
            log.warn("No se pudo marcar como vendida la obra {} en artwork-service: {}", artworkId, e.getMessage());
        }
    }

    /** RESERVED -> AVAILABLE. Best-effort. changedBy null = acción automática del sistema. */
    public void release(Long artworkId, Long changedBy) {
        long actor = changedBy != null ? changedBy : SYSTEM_ACTOR;
        try {
            restClient.post()
                    .uri(baseUrl() + "/artwork/release/{id}?changedBy={cb}&reason={r}", artworkId, actor, "Reserva liberada")
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception e) {
            log.warn("No se pudo liberar la obra {} en artwork-service: {}", artworkId, e.getMessage());
        }
    }
}
