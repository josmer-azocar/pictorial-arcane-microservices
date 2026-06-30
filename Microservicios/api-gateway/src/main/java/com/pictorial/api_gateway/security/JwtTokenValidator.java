package com.pictorial.api_gateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Collections;
import java.util.List;

/**
 * Valida y lee los JWT emitidos por core-service usando el secreto compartido
 * (security.jwt.secret, provisto por el config-server). No emite tokens: el gateway
 * es únicamente verificador (core-service sigue siendo el regidor que firma).
 */
@Component
public class JwtTokenValidator {

    @Value("${security.jwt.secret:586E3272357538782F413F4428472B4B6250655368566859703373373676397924}")
    private String secretKey;

    private Key getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Parsea el token verificando firma y expiración. Lanza JwtException si es inválido/expirado.
     */
    public Claims parse(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /** Email (subject) del token. */
    public String getUsername(Claims claims) {
        return claims.getSubject();
    }

    /** Lista de roles incrustados por core-service (ej. ["ROLE_ADMIN"]). */
    @SuppressWarnings("unchecked")
    public List<String> getRoles(Claims claims) {
        Object roles = claims.get("roles");
        if (roles instanceof List<?> list) {
            return list.stream().map(String::valueOf).toList();
        }
        return Collections.emptyList();
    }
}
