package com.uneg.pictorialArcane.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component // Marca esta clase como un componente gestionado por Spring
public class JwtAuthenticationFilter extends OncePerRequestFilter { // Extiende OncePerRequestFilter para ejecutarse una vez por cada petición

    private final JwtService jwtService; // Servicio para manipulación de JWT
    private final UserDetailsService userDetailsService; // Servicio para cargar datos del usuario

    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, // La petición entrante
            HttpServletResponse response, // La respuesta saliente
            FilterChain filterChain) throws ServletException, IOException { // Cadena de filtros para continuar la ejecución

        final String token = getTokenFromRequest(request); // Extrae el token del header
        final String email;

        if(token == null){ // Si no hay token, continúa con el siguiente filtro sin autenticar
            filterChain.doFilter(request,response);
            return;
        }

        email=jwtService.getUsernameFromToken(token); // Obtiene el usuario del token

        // Si hay usuario y no hay autenticación actual en el contexto
        if (email!=null && SecurityContextHolder.getContext().getAuthentication()==null)
        {
            UserDetails userDetails=userDetailsService.loadUserByUsername(email); // Carga los detalles del usuario desde la BD

            if (jwtService.isTokenValid(token, userDetails)) // Valida si el token es correcto y pertenece al usuario
            {
                // Crea un objeto de autenticación
                UsernamePasswordAuthenticationToken authToken= new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities());

                // Añade detalles adicionales de la petición (IP, sesión, etc.)
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Establece la autenticación en el contexto de seguridad de Spring
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }

        }

        filterChain.doFilter(request,response); // Continúa con el siguiente filtro en la cadena
    }

    // Método auxiliar para extraer el token del header Authorization
    private String getTokenFromRequest(HttpServletRequest request) {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if(StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")){ // Verifica formato "Bearer <token>"
            return authHeader.substring(7); // Retorna el token sin el prefijo "Bearer "
        }
        return null;
    }
}
