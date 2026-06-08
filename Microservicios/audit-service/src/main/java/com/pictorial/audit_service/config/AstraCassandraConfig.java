package com.pictorial.audit_service.config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.cassandra.autoconfigure.CqlSessionBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

import java.io.IOException;

@Configuration
public class AstraCassandraConfig{

    @Value("${astra.secure-connect-bundle}")
    private Resource secureConnectBundle;

    @Bean
    public CqlSessionBuilderCustomizer sessionBuilderCustomizer() {
        return builder -> {
            try {
                // Spring resuelve el prefijo 'classpath:' y le pasa la URL correcta al driver
                builder.withCloudSecureConnectBundle(secureConnectBundle.getURL());
            } catch (IOException e) {
                throw new IllegalStateException("No se pudo cargar el Secure Connect Bundle desde el classpath", e);
            }
        };
    }
}