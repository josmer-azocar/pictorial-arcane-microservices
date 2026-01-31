package com.uneg.pictorialArcane.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service // Marca la clase como un servicio de Spring
public class JwtService {

    // Clave secreta para firmar los tokens (Debería estar en application.properties en producción)
    public static final String SECRET_KEY = "586E3272357538782F413F4428472B4B6250655368566859703373373676397924";

    // Genera un token para un usuario sin claims extra
    public String getToken(UserDetails user) {
        return getToken(new HashMap<>(), user);
    }

    // Genera el token con claims extra, subject, fecha de emisión y expiración, y firma
    private String getToken(Map<String,Object> extraClaims, UserDetails user) {
        return Jwts
                .builder()
                .setClaims(extraClaims) // Añade claims personalizados
                .setSubject(user.getUsername()) // El subject es el email
                .setIssuedAt(new Date(System.currentTimeMillis())) // Fecha de creación actual
                .setExpiration(new Date(System.currentTimeMillis() + 1000*60*24)) // Expira en 24 minutos (ajustable)
                .signWith(getKey(), SignatureAlgorithm.HS256) // Firma con algoritmo HMAC SH256
                .compact(); // Construye el token string
    }

    // Decodifica la clave secreta Base64 para obtener la Key criptográfica
    private Key getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Extrae el email (Subject) del token
    public String getUsernameFromToken(String token) {
        return getClaim(token, Claims::getSubject);
    }

    // Valida si el token es válido: usuario coincide y no ha expirado
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String email = getUsernameFromToken(token);
        return (email.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // Obtiene todos los claims del token parseándolo con la clave secreta
    private Claims getAllClaims(String token)
    {
        return Jwts
                .parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Método genérico para obtener un claim específico
    public <T> T getClaim(String token, Function<Claims,T> claimsResolver)
    {
        final Claims claims = getAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Obtiene la fecha de expiración del token
    private Date getExpiration(String token)
    {
        return getClaim(token, Claims::getExpiration);
    }

    // Verifica si el token ha expirado comparando con la fecha actual
    private boolean isTokenExpired(String token)
    {
        return getExpiration(token).before(new Date());
    }
}
