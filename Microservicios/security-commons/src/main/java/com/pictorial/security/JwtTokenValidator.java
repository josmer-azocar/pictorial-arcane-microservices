package com.pictorial.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.security.Key;
import java.util.Collections;
import java.util.List;

/**
 * Verificador de JWT compartido por los microservicios. Usa el secreto centralizado
 * (security.jwt.secret, servido por el config-server) que es el mismo con el que core-service
 * firma los tokens. Esta clase NO emite tokens: core-service sigue siendo el único emisor.
 */
public class JwtTokenValidator {

    private final String secretKey;

    public JwtTokenValidator(@Value("${security.jwt.secret:586E3272357538782F413F4428472B4B6250655368566859703373373676397924}") String secretKey) {
        this.secretKey = secretKey;
    }

    private Key getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /** Verifica firma + expiración. Lanza JwtException/IllegalArgumentException si el token es inválido. */
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

    /** Roles incrustados por core-service (ej. ["ROLE_ADMIN"]) como authorities de Spring Security. */
    @SuppressWarnings("unchecked")
    public List<SimpleGrantedAuthority> getAuthorities(Claims claims) {
        Object roles = claims.get("roles");
        if (roles instanceof List<?> list) {
            return list.stream()
                    .map(String::valueOf)
                    .map(SimpleGrantedAuthority::new)
                    .toList();
        }
        return Collections.emptyList();
    }
}
