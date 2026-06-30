package com.pictorial.security;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Auto-configuración de seguridad compartida. Cualquier microservicio que añada la dependencia
 * 'security-commons' obtiene automáticamente:
 *  - validación del JWT reenviado por el gateway (defensa en profundidad),
 *  - capacidad de usar @PreAuthorize / @EnableMethodSecurity en sus controladores,
 *  - manejadores 401/403 homogéneos.
 *
 * A nivel HTTP se permite todo (anyRequest().permitAll()) para no romper las llamadas internas
 * service-to-service (que no portan token). La protección de cara al exterior la garantiza el
 * gateway; la protección fina por rol se activa anotando los endpoints con @PreAuthorize.
 */
@AutoConfiguration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class CommonSecurityAutoConfiguration {

    @Bean
    public JwtTokenValidator jwtTokenValidator(
            @Value("${security.jwt.secret:586E3272357538782F413F4428472B4B6250655368566859703373373676397924}") String secret) {
        return new JwtTokenValidator(secret);
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(JwtTokenValidator tokenValidator) {
        return new JwtAuthenticationFilter(tokenValidator);
    }

    @Bean
    public SecurityExceptionAdvice securityExceptionAdvice() {
        return new SecurityExceptionAdvice();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                   JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\": \"No estas autenticado\"}");
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\": \"Acceso denegado: No tienes el rol necesario\"}");
                        })
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
