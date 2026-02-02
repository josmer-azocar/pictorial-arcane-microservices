package com.uneg.pictorialArcane.config;

import com.uneg.pictorialArcane.jwt.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration // Indica que esta clase contiene configuraciones de Spring
@EnableWebSecurity
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter; // Filtro personalizado para validar JWT
    private final AuthenticationProvider authProvider; // Proveedor de autenticación (DAO en este caso)

    // Constructor para inyección de dependencias
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, AuthenticationProvider authProvider) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.authProvider = authProvider;
    }

    @Bean // Define un bean de Spring para la cadena de filtros de seguridad
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http

                .csrf(csrf -> csrf.disable()) // Deshabilita CSRF (Cross-Site Request Forgery) ya que usamos tokens, no sesiones

                .authorizeHttpRequests(authRequest -> // Configura las reglas de autorización para las peticiones HTTP
                        authRequest
                                .requestMatchers("/auth/**","/swagger-ui.html", // Permite acceso público a estas rutas
                                        "/swagger-ui/**","/v3/api-docs/**",
                                        "/webjars/**")
                                .permitAll() // Permite el acceso sin autenticación
                                .anyRequest().authenticated() // Cualquier otra petición requiere autenticación
                        )
                .sessionManagement(sessionManager-> // Configuración de gestión de sesiones
                        sessionManager
                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Indica que no se crearán sesiones (stateless), ideal para REST APIs con JWT
                .authenticationProvider(authProvider) // Establece el proveedor de autenticación personalizado
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class) // Añade el filtro JWT antes del filtro estándar de autenticación de usuario/contraseña
               .build(); // Construye la cadena de filtros

    }
}
