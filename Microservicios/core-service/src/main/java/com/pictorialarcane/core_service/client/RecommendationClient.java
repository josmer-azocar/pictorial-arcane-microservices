package com.pictorialarcane.core_service.client;

import com.pictorialarcane.core_service.client.dto.ClientSyncRequest;
import com.pictorialarcane.core_service.client.dto.PurchaseSyncRequest;
import com.pictorialarcane.core_service.client.dto.ViewSyncRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.loadbalancer.LoadBalancerClient;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

/**
 * Cliente síncrono hacia el recommendation-service. Mantiene el grafo de Neo4j
 * sincronizado de forma eventual con los eventos de negocio de core-service.
 * La instancia se resuelve por Eureka con LoadBalancerClient.
 *
 * Todas las llamadas son "best-effort": un fallo de sincronización se registra y se ignora,
 * para no afectar el flujo principal (la venta ya está consolidada en la BD relacional).
 */
@Component
public class RecommendationClient {

    private static final Logger log = LoggerFactory.getLogger(RecommendationClient.class);
    private static final String SERVICE_ID = "recommendation-service";

    private final RestClient restClient = RestClient.create();
    private final LoadBalancerClient loadBalancer;

    public RecommendationClient(LoadBalancerClient loadBalancer) {
        this.loadBalancer = loadBalancer;
    }

    private String baseUrl() {
        ServiceInstance instance = loadBalancer.choose(SERVICE_ID);
        if (instance == null) {
            throw new IllegalStateException("No hay instancias de " + SERVICE_ID + " en Eureka");
        }
        return instance.getUri().toString();
    }

    /** Materializa (Comprador)-[:BOUGHT]->(Artwork) en el grafo. Best-effort. */
    public void syncPurchase(PurchaseSyncRequest request) {
        try {
            restClient.post()
                    .uri(baseUrl() + "/api/v1/recommendations/sync/purchase")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .toBodilessEntity();
            log.debug("Compra sincronizada con recommendation-service (compradorId={}, artworkId={})",
                    request.compradorId(), request.artworkId());
        } catch (Exception e) {
            log.warn("No se pudo sincronizar la compra con recommendation-service (compradorId={}, artworkId={}): {}",
                    request.compradorId(), request.artworkId(), e.getMessage());
        }
    }

    /** Materializa (Comprador)-[:SAW]->(Artwork) en el grafo. Best-effort. */
    public void syncView(ViewSyncRequest request) {
        try {
            restClient.post()
                    .uri(baseUrl() + "/api/v1/recommendations/sync/view")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .toBodilessEntity();
            log.debug("Vista sincronizada con recommendation-service (compradorId={}, artworkId={})",
                    request.compradorId(), request.artworkId());
        } catch (Exception e) {
            log.warn("No se pudo sincronizar la vista con recommendation-service (compradorId={}, artworkId={}): {}",
                    request.compradorId(), request.artworkId(), e.getMessage());
        }
    }

    /** Crea/actualiza el nodo (:Comprador) en el grafo al registrarse el cliente. Best-effort. */
    public void syncClient(ClientSyncRequest request) {
        try {
            restClient.post()
                    .uri(baseUrl() + "/api/v1/recommendations/sync/client")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .toBodilessEntity();
            log.debug("Comprador sincronizado con recommendation-service (compradorId={})", request.compradorId());
        } catch (Exception e) {
            log.warn("No se pudo sincronizar el comprador con recommendation-service (compradorId={}): {}",
                    request.compradorId(), e.getMessage());
        }
    }
}
