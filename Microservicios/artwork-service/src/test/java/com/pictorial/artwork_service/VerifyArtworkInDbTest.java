package com.pictorial.artwork_service;

import com.pictorial.artwork_service.document.ArtWorkDocument;
import com.pictorial.artwork_service.repository.ArtWorkRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

@SpringBootTest
class VerifyArtworkInDbTest {

    @Autowired
    private ArtWorkRepository artWorkRepository;

    @Test
    void verifyDb() {
        System.out.println("=== VERIFICANDO BASE DE DATOS EN LA NUBE ===");
        Optional<ArtWorkDocument> opt = artWorkRepository.findById("6a2ac9cf82395d5f41a99314");
        if (opt.isPresent()) {
            ArtWorkDocument art = opt.get();
            System.out.println("¡ENCONTRADA!");
            System.out.println(" - ID: " + art.getId());
            System.out.println(" - Nombre: " + art.getName());
            System.out.println(" - URL de Imagen: " + art.getImageUrl());
        } else {
            System.out.println("No se encontró la obra con ID 6a2ac9cf82395d5f41a99314.");
            System.out.println("Obras registradas actualmente:");
            artWorkRepository.findAll().forEach(a -> {
                System.out.println(" - ID: " + a.getId() + " | Nombre: " + a.getName() + " | Imagen: " + a.getImageUrl());
            });
        }
        System.out.println("=== FIN VERIFICACIÓN ===");
    }
}
