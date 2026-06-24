package com.pictorial.recommendation_service.repository;

import com.pictorial.recommendation_service.core.PurchaseHistoryProjection;
import com.pictorial.recommendation_service.nodes.ArtworkNode;
import com.pictorial.recommendation_service.nodes.CompradorNode;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CompradorRepository extends Neo4jRepository<CompradorNode, String> {

    Optional<CompradorNode> findByEmail(String email);

    // 7.1 Recomendar obras del mismo género que las compradas por un usuario
    @Query("MATCH (u: Comprador {id: $userId})-[:BOUGHT]->(obraComprada: Artwork)-[:HAS_GENRE]->(g:Genre) " +
            "WITH u, COLLECT(obraComprada) AS compradas, COLLECT(DISTINCT g) AS generos " +
            "UNWIND generos AS gen " +
            "MATCH (gen)<-[:HAS_GENRE]-(recomendada: Artwork) " +
            "WHERE NOT recomendada IN compradas AND recomendada.status = 'AVAILABLE' " +
            "RETURN DISTINCT recomendada " +
            "ORDER BY recomendada.price DESC LIMIT 10")
    List<ArtworkNode> getRecommendationsBasedOnPurchases(@Param("userId") String userId);

    // 7.3 Historial de compras de un usuario con detalles de artista y género (Proyección tabular)
    @Query("MATCH (u: Comprador {id: $userId})-[c:BOUGHT]->(aw: Artwork)<-[:CREATED]-(a: Artist) " +
            "OPTIONAL MATCH (aw)-[:HAS_GENRE]->(g:Genre) " +
            "RETURN u.name AS comprador, aw.name AS obra, (a.name + ' ' + a.lastName) AS artista, g.name AS genero, c.fecha AS fechaCompra")
    List<PurchaseHistoryProjection> getPurchaseHistoryDetails(@Param("userId") String userId);

    // 7.6 Recomendaciones basadas en todas las obras vistas (SAW)
    @Query("MATCH (u: Comprador {id: $userId})-[:SAW]->(obraVista: Artwork)-[:HAS_GENRE]->(g:Genre) " +
            "WITH u, COLLECT(obraVista) AS vistas, COLLECT(DISTINCT g) AS generos " +
            "UNWIND generos AS gen " +
            "MATCH (gen)<-[:HAS_GENRE]-(recomendada: Artwork) " +
            "WHERE NOT recomendada IN vistas AND recomendada.status = 'AVAILABLE' " +
            "RETURN DISTINCT recomendada " +
            "ORDER BY recomendada.price DESC LIMIT 10")
    List<ArtworkNode> getRecommendationsBasedOnViews(@Param("userId") String userId);

    // 7.7 Recomendaciones basadas estrictamente en la ÚLTIMA obra vista
    @Query("MATCH (u: Comprador {id: $userId})-[v:SAW]->(ultima: Artwork) " +
            "WITH ultima ORDER BY v.fecha DESC LIMIT 1 " +
            "MATCH (ultima)-[:HAS_GENRE]->(g: Genre)<-[:HAS_GENRE]-(recomendada: Artwork) " +
            "WHERE recomendada.artworkId <> ultima.artworkId AND recomendada.status = 'AVAILABLE' " +
            "RETURN recomendada " +
            "ORDER BY recomendada.price DESC LIMIT 10")
    List<ArtworkNode> getRecommendationsBasedOnLastViewed(@Param("userId") String userId);
}
