package com.uneg.pictorialArcane.config;

import com.uneg.pictorialArcane.jwt.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;


@Configuration // Indica que esta clase contiene configuraciones de Spring
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
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

                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable()) // Deshabilita CSRF (Cross-Site Request Forgery) ya que usamos tokens, no sesiones

                .authorizeHttpRequests(authRequest -> // Configura las reglas de autorización para las peticiones HTTP
                        authRequest.anyRequest().permitAll()

                        //DEPRECATED init
//                                .requestMatchers("/auth/**","/swagger-ui.html", // Permite acceso público a estas rutas
//                                        "/swagger-ui/**","/v3/api-docs/**",
//                                        "/webjars/**","/artwork/search/**")
//
//                                .permitAll() // Permite el acceso sin autenticación
//                                .anyRequest().authenticated() // Cualquier otra petición requiere autenticación
                        //DEPRECATED end

                        )

                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            // Esto maneja el error 401 (No estás logueado o token malo)
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\": \"No estas autenticado\"}");
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            // Esto maneja el error 403 (Estás logueado pero no tienes permiso)
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\": \"Acceso denegado: No tienes el rol necesario\"}");
                        })
                )
                .sessionManagement(sessionManager-> // Configuración de gestión de sesiones
                        sessionManager
                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Indica que no se crearán sesiones (stateless), ideal para REST APIs con JWT
                .authenticationProvider(authProvider) // Establece el proveedor de autenticación personalizado
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class) // Añade el filtro JWT antes del filtro estándar de autenticación de usuario/contraseña
               .build(); // Construye la cadena de filtros

    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173","https://ambitious-ground-007308f1e.4.azurestaticapps.net")); // frontend Vite
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Origin", "Accept"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
