package com.pictorial.recommendation_service.core.service;

import com.pictorial.recommendation_service.repository.ArtworkRepository;
import com.pictorial.recommendation_service.repository.GenreRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class RecommendationTestService {

    private final ArtworkRepository artworkRepository;
    private final GenreRepository genreRepository;

    // Inyección por constructor
    public RecommendationTestService(ArtworkRepository artworkRepository, GenreRepository genreRepository) {
        this.artworkRepository = artworkRepository;
        this.genreRepository = genreRepository;
    }

    /**
     * Verifica la conexión contando los elementos actuales del grafo.
     */
    public Map<String, Object> verifyDatabaseConnection() {
        Map<String, Object> status = new HashMap<>();

        try {
            // Realiza consultas de conteo en la base de datos
            long totalArtworks = artworkRepository.count();
            long totalGenres = genreRepository.count();

            status.put("status", "SUCCESS");
            status.put("message", "Conexión exitosa con Neo4j AuraDB.");
            status.put("total_obras_detectadas", totalArtworks);
            status.put("total_generos_detectados", totalGenres);

        } catch (Exception e) {
            status.put("status", "ERROR");
            status.put("message", "Fallo al conectar con el grafo: " + e.getMessage());
        }

        return status;
    }
}
