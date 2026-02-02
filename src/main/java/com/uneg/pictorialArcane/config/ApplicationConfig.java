package com.uneg.pictorialArcane.config;

import com.uneg.pictorialArcane.persistence.crud_repository.CrudUserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration // Marca la clase como una fuente de definiciones de beans para el contexto de la aplicación
public class ApplicationConfig {

    private final CrudUserRepository crudUserRepository; // Repositorio para acceder a los datos de usuario

    public ApplicationConfig(CrudUserRepository crudUserRepository) {
        this.crudUserRepository = crudUserRepository;
    }

    @Bean // Define el AuthenticationManager, encargado de manejar la autenticación
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) {
        try {
            return config.getAuthenticationManager(); // Obtiene el AuthenticationManager de la configuración predeterminada
        } catch (Exception e) {
        throw new RuntimeException("Error configuring AuthenticationManager", e);
        }
    }

    @Bean // Define el proveedor de autenticación
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider(userDetailService());
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;
    }

    @Bean // Define el codificador de contraseñas (BCrypt)
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Retorna una instancia de BCryptPasswordEncoder para hashear contraseñas
    }

    @Bean // Define el servicio que carga los detalles del usuario desde la BD
    public UserDetailsService userDetailService() {
        return email -> crudUserRepository.findByEmail(email)
                .orElseThrow(()-> new UsernameNotFoundException("User not found"));
    }

}