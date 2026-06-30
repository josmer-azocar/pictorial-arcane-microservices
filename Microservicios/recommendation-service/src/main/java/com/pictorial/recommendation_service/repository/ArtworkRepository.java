package com.pictorial.recommendation_service.repository;

import com.pictorial.recommendation_service.core.ArtworkRecommendationProjection;
import com.pictorial.recommendation_service.core.TopArtworkProjection;
import com.pictorial.recommendation_service.nodes.ArtworkNode;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ArtworkRepository extends Neo4jRepository<ArtworkNode, Long> {

    // 7.2 Recomendar obras del mismo género que una obra específica
    @Query("MATCH (aw: Artwork {artworkId: $artworkId})-[:HAS_GENRE]->(g: Genre)<-[:HAS_GENRE]-(recomendada: Artwork) " +
            "WHERE recomendada.artworkId <> $artworkId AND recomendada.status = 'AVAILABLE' " +
            "RETURN recomendada.artworkId AS artworkId, recomendada.name AS obra, " +
            "       g.name AS genero, toFloat(recomendada.price) AS precio " +
            "ORDER BY precio DESC")
    List<ArtworkRecommendationProjection> findRecommendationsByArtworkGenre(@Param("artworkId") Long artworkId);

    // 7.4 Top 5 de obras más compradas
    @Query("MATCH (aw: Artwork)<-[:BOUGHT]-(:Comprador) " +
            "RETURN aw.artworkId AS id, aw.name AS obra, COUNT(*) AS vecesComprada " +
            "ORDER BY vecesComprada DESC LIMIT 5")
    List<TopArtworkProjection> findTop5MostBoughtArtworks();

    // Fallback: Obras disponibles más compradas/populares en el catálogo
    @Query("MATCH (aw: Artwork) " +
            "WHERE aw.status = 'AVAILABLE' " +
            "OPTIONAL MATCH (aw)<-[b:BOUGHT]-(:Comprador) " +
            "WITH aw, COUNT(b) AS compras " +
            "OPTIONAL MATCH (aw)-[:HAS_GENRE]->(g:Genre) " +
            "RETURN aw.artworkId AS artworkId, aw.name AS obra, g.name AS genero, toFloat(aw.price) AS precio " +
            "ORDER BY compras DESC LIMIT $limit")
    List<ArtworkRecommendationProjection> findTopAvailableArtworks(@Param("limit") int limit);

    // Verifica la existencia de una obra por su clave de negocio (para validar antes del sync)
    @Query("MATCH (aw: Artwork {artworkId: $artworkId}) RETURN count(aw) > 0")
    boolean existsByArtworkId(@Param("artworkId") Long artworkId);
}
