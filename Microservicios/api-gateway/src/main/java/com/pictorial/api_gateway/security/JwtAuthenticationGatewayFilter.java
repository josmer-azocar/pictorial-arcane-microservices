package com.pictorial.api_gateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;

/**
 * Autenticación en el gateway. El modelo es "el gateway autentica, los servicios autorizan":
 *  - Si NO hay token, la petición pasa como anónima; cada microservicio decide con @PreAuthorize
 *    si el endpoint es público (p. ej. consultar obras) o requiere rol.
 *  - Si HAY token, se valida (firma + expiración): si es inválido/expirado se corta con 401;
 *    si es válido se propaga la identidad a los servicios downstream mediante cabeceras de confianza
 *    (X-Auth-User, X-Auth-Roles) además de reenviar el Authorization original.
 *
 * Las cabeceras X-Auth-* entrantes del cliente se eliminan SIEMPRE para evitar suplantación.
 */
@Component
public class JwtAuthenticationGatewayFilter implements WebFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationGatewayFilter.class);

    public static final String HEADER_USER = "X-Auth-User";
    public static final String HEADER_ROLES = "X-Auth-Roles";

    private final JwtTokenValidator tokenValidator;

    public JwtAuthenticationGatewayFilter(JwtTokenValidator tokenValidator) {
        this.tokenValidator = tokenValidator;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        // Nunca confiar en cabeceras de identidad que ponga el cliente.
        ServerWebExchange sanitized = exchange.mutate()
                .request(r -> r.headers(h -> {
                    h.remove(HEADER_USER);
                    h.remove(HEADER_ROLES);
                }))
                .build();

        // Las peticiones preflight CORS (OPTIONS) no llevan token: deben pasar.
        if (HttpMethod.OPTIONS.equals(sanitized.getRequest().getMethod())) {
            return chain.filter(sanitized);
        }

        final String token = extractToken(sanitized.getRequest());

        // Sin token: petición anónima. La autorización fina la aplica el microservicio (@PreAuthorize).
        if (token == null) {
            return chain.filter(sanitized);
        }

        // Con token: debe ser válido. Si lo es, propaga identidad; si no, corta con 401.
        try {
            Claims claims = tokenValidator.parse(token);
            String user = tokenValidator.getUsername(claims);
            String roles = String.join(",", tokenValidator.getRoles(claims));

            ServerWebExchange authenticated = sanitized.mutate()
                    .request(r -> r.headers(h -> {
                        h.set(HEADER_USER, user);
                        h.set(HEADER_ROLES, roles);
                    }))
                    .build();

            return chain.filter(authenticated);
        } catch (JwtException | IllegalArgumentException ex) {
            log.debug("JWT inválido en {}: {}", sanitized.getRequest().getURI().getPath(), ex.getMessage());
            return unauthorized(sanitized, "Token inválido o expirado");
        }
    }

    private String extractToken(ServerHttpRequest request) {
        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange, String message) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        byte[] bytes = ("{\"error\": \"" + message + "\"}").getBytes(StandardCharsets.UTF_8);
        DataBuffer buffer = response.bufferFactory().wrap(bytes);
        return response.writeWith(Mono.just(buffer));
    }

    @Override
    public int getOrder() {
        // Después del WebFilterChainProxy de Spring Security (-100), antes del enrutamiento del gateway.
        return -50;
    }
}
