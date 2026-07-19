package com.pictorialarcane.core_service.client;

import com.pictorialarcane.core_service.client.dto.BillingByMonthRequest;
import com.pictorialarcane.core_service.client.dto.SecurityLogRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.loadbalancer.LoadBalancerClient;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * Cliente síncrono hacia el audit-service. La instancia se resuelve por Eureka mediante
 * LoadBalancerClient en tiempo de ejecución (no se usa un RestClient.Builder @LoadBalanced
 * global para no interferir con el cliente HTTP interno de Eureka).
 *
 * Todas las llamadas son "best-effort": un fallo de auditoría se registra y se ignora.
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

    /** Registra una venta facturada en billing_by_month. */
    public void registerBilling(BillingByMonthRequest request) {
        try {
            restClient.post()
                    .uri(baseUrl() + "/billing-by-month/add")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .toBodilessEntity();
            log.debug("Facturación enviada a audit-service (saleId={})", request.saleId());
        } catch (Exception e) {
            log.warn("No se pudo registrar la facturación en audit-service (saleId={}): {}",
                    request.saleId(), e.getMessage());
        }
    }

    /** Registra un evento de seguridad en security_log_by_event. */
    public void registerSecurityLog(SecurityLogRequest request) {
        try {
            SecurityLogRequest enriched = enrichRequest(request);
            restClient.post()
                    .uri(baseUrl() + "/security-log-by-event/add")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(enriched)
                    .retrieve()
                    .toBodilessEntity();
            log.debug("Evento de seguridad enviado a audit-service (event={})", enriched.eventType());
        } catch (Exception e) {
            log.warn("No se pudo registrar el evento de seguridad en audit-service (event={}): {}",
                    request.eventType(), e.getMessage());
        }
    }

    private SecurityLogRequest enrichRequest(SecurityLogRequest request) {
        String ipAddress = request.ipAddress();
        String sessionId = request.sessionId();

        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest httpRequest = attributes.getRequest();
                if (ipAddress == null || ipAddress.isBlank()) {
                    ipAddress = httpRequest.getHeader("X-Forwarded-For");
                    if (ipAddress == null || ipAddress.isBlank() || "unknown".equalsIgnoreCase(ipAddress)) {
                        ipAddress = httpRequest.getRemoteAddr();
                    }
                    if (ipAddress != null && ipAddress.contains(",")) {
                        ipAddress = ipAddress.split(",")[0].trim();
                    }
                }
                if (sessionId == null || sessionId.isBlank()) {
                    HttpSession session = httpRequest.getSession(false);
                    if (session != null) {
                        sessionId = session.getId();
                    } else {
                        sessionId = httpRequest.getHeader("X-Session-Id");
                    }
                }
            }
        } catch (Exception e) {
            log.warn("No se pudo obtener información del request actual para auditoría: {}", e.getMessage());
        }

        return new SecurityLogRequest(
                request.eventType(),
                request.adminDni(),
                request.clientDni(),
                request.details(),
                ipAddress,
                sessionId
        );
    }
}

