package com.pictorial.artwork_service.client;

import com.pictorial.artwork_service.client.dto.ArtworkStatusHistoryRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.loadbalancer.LoadBalancerClient;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

/**
 * Cliente síncrono hacia el audit-service. La instancia se resuelve por Eureka mediante
 * LoadBalancerClient (sin RestClient.Builder @LoadBalanced global, para no interferir con
 * el cliente HTTP interno de Eureka). Las llamadas son "best-effort".
 */
@Component
public class AuditClient {

    private static final Logger log = LoggerFactory.getLogger(AuditClient.class);
    private static final String SERVICE_ID = "audit-service";

    private final RestClient restClient = RestClient.create();
    private final LoadBalancerClient loadBalancer;

    public AuditClient(LoadBalancerClient loadBalancer) {
        this.loadBalancer = loadBalancer;
    }

    private String baseUrl() {
        ServiceInstance instance = loadBalancer.choose(SERVICE_ID);
        if (instance == null) {
            throw new IllegalStateException("No hay instancias de " + SERVICE_ID + " en Eureka");
        }
        return instance.getUri().toString();
    }

    /** Registra un cambio de estado de obra en artwork_status_history. */
    public void registerStatusChange(ArtworkStatusHistoryRequest request) {
        try {
            restClient.post()
                    .uri(baseUrl() + "/artwork-status-history/add")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .toBodilessEntity();
            log.debug("Historial de estado enviado a audit-service (artworkId={})", request.artworkId());
        } catch (Exception e) {
            log.warn("No se pudo registrar el historial de estado en audit-service (artworkId={}): {}",
                    request.artworkId(), e.getMessage());
        }
    }
}
