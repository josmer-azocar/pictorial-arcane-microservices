package com.pictorial.recommendation_service.repository;

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
            "RETURN recomendada")
    List<ArtworkNode> findRecommendationsByArtworkGenre(@Param("artworkId") Long artworkId);

    // 7.4 Top 5 de obras más compradas
    @Query("MATCH (aw: Artwork)<-[:BOUGHT]-(:Comprador) " +
            "RETURN aw " +
            "ORDER BY COUNT(*) DESC LIMIT 5")
    List<ArtworkNode> findTop5MostBoughtArtworks();
}