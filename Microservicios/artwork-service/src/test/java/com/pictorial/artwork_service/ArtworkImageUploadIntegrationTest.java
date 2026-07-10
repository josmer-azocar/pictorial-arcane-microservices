package com.pictorial.artwork_service;

import com.pictorial.artwork_service.document.ArtWorkDocument;
import com.pictorial.artwork_service.repository.ArtWorkRepository;
import com.pictorial.artwork_service.service.AzureBlobService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ArtworkImageUploadIntegrationTest {

    @Autowired
    private ArtWorkRepository artWorkRepository;

    @Autowired
    private AzureBlobService azureBlobService;

    @Test
    void testArtworkImageUploadIntegration() throws IOException {
        System.out.println("=== INICIANDO PRUEBA DE INTEGRACIÓN DE CARGA DE IMAGEN ===");

        // 1. Obtener obras de arte desde MongoDB
        List<ArtWorkDocument> artworks = artWorkRepository.findAll();
        System.out.println("Obras de arte encontradas en MongoDB: " + artworks.size());

        ArtWorkDocument targetArtwork;
        if (artworks.isEmpty()) {
            System.out.println("No se encontraron obras. Creando una obra de prueba...");
            targetArtwork = ArtWorkDocument.builder()
                    .artworkId(9999L)
                    .name("Obra de Prueba Integración")
                    .status("AVAILABLE")
                    .price(1500.0)
                    .artistId("artist-test-123")
                    .artistName("Artista de Prueba")
                    .createdAt(LocalDateTime.now())
                    .build();
            targetArtwork = artWorkRepository.save(targetArtwork);
            System.out.println("Creada obra temporal con ID: " + targetArtwork.getId());
        } else {
            targetArtwork = artworks.get(0);
            System.out.println("Seleccionada obra existente para la prueba:");
            System.out.println(" - ID (Mongo): " + targetArtwork.getId());
            System.out.println(" - ID de Negocio: " + targetArtwork.getArtworkId());
            System.out.println(" - Nombre: " + targetArtwork.getName());
            System.out.println(" - URL Imagen previa: " + targetArtwork.getImageUrl());
        }

        // 2. Preparar el archivo de imagen especificado por el usuario
        File imageFile = new File("C:/Users/AzocarPC/Documents/GitHub/pictorial-arcane-microservices/Gemini_Generated_Image_bszyarbszyarbszy.png");
        assertTrue(imageFile.exists(), "El archivo de imagen no existe en la ruta provista!");
        System.out.println("Archivo de imagen cargado: " + imageFile.getAbsolutePath() + " (" + imageFile.length() + " bytes)");

        MockMultipartFile multipartFile;
        try (FileInputStream fis = new FileInputStream(imageFile)) {
            multipartFile = new MockMultipartFile(
                    "file",
                    imageFile.getName(),
                    "image/png",
                    fis
            );
        }

        // 3. Ejecutar la subida de imagen usando el servicio
        System.out.println("Invocando AzureBlobService para subir la imagen...");
        String uploadedUrl = azureBlobService.uploadArtworkImage(targetArtwork.getId(), multipartFile);
        System.out.println("¡Imagen subida con éxito!");
        System.out.println("URL devuelta por Azure: " + uploadedUrl);

        // 4. Verificar que se actualizó en la base de datos
        ArtWorkDocument updatedArtwork = artWorkRepository.findById(targetArtwork.getId()).orElse(null);
        assertNotNull(updatedArtwork);
        assertEquals(uploadedUrl, updatedArtwork.getImageUrl(), "La URL de la imagen en base de datos no coincide con la URL de subida!");
        System.out.println("Confirmación de base de datos:");
        System.out.println(" - ID Obra: " + updatedArtwork.getId());
        System.out.println(" - Nueva URL en DB: " + updatedArtwork.getImageUrl());
        System.out.println("=== PRUEBA DE INTEGRACIÓN COMPLETADA CON ÉXITO ===");
    }
}
