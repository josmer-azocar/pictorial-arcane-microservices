package com.pictorial.artwork_service;

import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import org.junit.jupiter.api.Test;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

import static org.junit.jupiter.api.Assertions.assertNotNull;

class AzureConnectionManualTest {

    @Test
    void testConnection() throws IOException {
        System.out.println("=== Iniciando Prueba de Conexión Manual a Azure Blob Storage ===");

        // Leer application.properties
        Properties props = new Properties();
        try (FileInputStream fis = new FileInputStream("src/main/resources/application.properties")) {
            props.load(fis);
        }

        String connStringProp = props.getProperty("azure.storage.connection-string");
        String containerName = props.getProperty("azure.storage.container-name");

        // Resolver variable de entorno si es necesario
        String connectionString = connStringProp;
        if (connStringProp != null && connStringProp.contains("${STORAGE_CONNECTION}")) {
            connectionString = System.getenv("STORAGE_CONNECTION");
            if (connectionString == null) {
                connectionString = System.getProperty("STORAGE_CONNECTION");
            }
        }

        System.out.println("Container Name: " + containerName);
        System.out.println("Propiedad en archivo: " + connStringProp);
        System.out.println("Cadena de conexión final resuelta: " + (connectionString != null ? (connectionString.substring(0, Math.min(Math.max(0, connectionString.length()), 35)) + "...") : "null"));

        assertNotNull(connectionString, "La cadena de conexión (STORAGE_CONNECTION) no está definida en las variables de entorno ni en properties.");
        assertNotNull(containerName, "El nombre del contenedor no está definido.");

        try {
            BlobContainerClient containerClient = new BlobServiceClientBuilder()
                    .connectionString(connectionString)
                    .buildClient()
                    .getBlobContainerClient(containerName);

            boolean exists = containerClient.exists();
            System.out.println("¡CONEXIÓN EXITOSA! El contenedor existe: " + exists);
        } catch (Exception e) {
            System.err.println("ERROR al conectar con Azure Blob Storage: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
