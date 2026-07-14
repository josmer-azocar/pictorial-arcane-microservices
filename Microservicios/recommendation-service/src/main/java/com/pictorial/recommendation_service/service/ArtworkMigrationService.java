package com.pictorial.recommendation_service.service;

import com.pictorial.recommendation_service.nodes.ArtworkNode;
import com.pictorial.recommendation_service.repository.ArtworkRepository;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
public class ArtworkMigrationService{

    private static final Logger log = LoggerFactory.getLogger(ArtworkMigrationService.class);

    @Autowired
    private ArtworkRepository artworkRepository;

    @Autowired
    private EmbeddingModel embeddingModel; // Inyectado automáticamente gracias al starter de Gemini

    // Evita que dos migraciones corran al mismo tiempo (ej. dos POST a /run seguidos)
    private final AtomicBoolean migracionEnCurso = new AtomicBoolean(false);

    @Async // Esto hace que corra de forma asíncrona en segundo plano
    public void migrarObrasAVectores() {
        if (!migracionEnCurso.compareAndSet(false, true)) {
            log.warn("Ya hay una migración en curso; se ignora esta nueva solicitud.");
            return;
        }

        try {
            int batchSize = 50; // Procesamos de 50 en 50
            long totalPendientes = artworkRepository.countArtworksSinEmbedding();
            log.info("--- INICIANDO MIGRACIÓN SEMÁNTICA ---");
            log.info("Total de obras por indexar: {}", totalPendientes);

            int procesados = 0;
            // Obras que fallaron de forma persistente (ej. bloqueo de contenido, rate limit
            // agotado): las excluimos del conteo de "pendientes" para no reintentarlas para
            // siempre en cada vuelta del bucle.
            Set<Long> obrasFallidas = new HashSet<>();

            while (true) {
                // Traemos un lote de obras sin embedding, saltando las que ya sabemos que fallan
                List<ArtworkNode> lote = artworkRepository.findArtworksSinEmbedding(obrasFallidas.size(), batchSize);

                if (lote.isEmpty()) {
                    break; // Ya terminamos con todo el catálogo
                }

                int procesadosAntesDelLote = procesados;

                for (ArtworkNode artwork : lote) {
                    try {
                        // 1. Llamar a Gemini de forma gratuita para generar el vector
                        // El modelo text-embedding-004 devolverá una lista de 768 números
                        float[] vector = embeddingModel.embed(artwork.getName());

                        // 2. Asignar el vector y guardar el nodo en Neo4j
                        artwork.setEmbedding(vector);
                        artworkRepository.save(artwork);

                        procesados++;
                    } catch (Exception e) {
                        log.error("Error indexando obra ID: {}. Causa: {}", artwork.getArtworkId(), e.getMessage());
                        obrasFallidas.add(artwork.getArtworkId());
                        // Si la API gratuita te da error de Rate Limit (Too Many Requests), el bucle continuará con la siguiente
                    }
                }

                log.info("Progreso de migración: {} / {} procesados.", procesados, totalPendientes);

                if (procesados == procesadosAntesDelLote) {
                    // Ninguna obra del lote se pudo indexar: seguir insistiría para siempre
                    log.warn("Ningún elemento del último lote pudo indexarse; se detiene la migración. "
                            + "Obras con error ({}): {}", obrasFallidas.size(), obrasFallidas);
                    break;
                }

                // Pausa de 1.5 segundos entre lotes para respetar los límites de la API de Gemini
                try {
                    Thread.sleep(1500);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    return;
                }
            }

            log.info("--- MIGRACIÓN DE VECTORES COMPLETADA: {} procesadas, {} con error ---", procesados,
                    obrasFallidas.size());
        } finally {
            migracionEnCurso.set(false);
        }
    }
}
