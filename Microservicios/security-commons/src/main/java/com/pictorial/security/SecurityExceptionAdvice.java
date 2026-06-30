package com.pictorial.security;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

/**
 * Traduce las denegaciones de @PreAuthorize (AccessDeniedException / AuthorizationDeniedException)
 * a respuestas HTTP correctas (401 si el usuario es anónimo, 403 si está autenticado pero sin rol).
 *
 * Se registra con la MÁXIMA precedencia para ganar a cualquier @ExceptionHandler(Exception.class)
 * genérico que tengan los servicios (que de otro modo enmascararía la denegación como 500).
 */
@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class SecurityExceptionAdvice {

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleAccessDenied(AccessDeniedException ex) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean anonymous = (auth == null) || (auth instanceof AnonymousAuthenticationToken);

        HttpStatus status = anonymous ? HttpStatus.UNAUTHORIZED : HttpStatus.FORBIDDEN;
        String message = anonymous
                ? "No estas autenticado"
                : "Acceso denegado: No tienes el rol necesario";

        return ResponseEntity.status(status).body(Map.of("error", message));
    }
}
