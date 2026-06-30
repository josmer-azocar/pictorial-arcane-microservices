package com.pictorial.recommendation_service.repository;

import com.pictorial.recommendation_service.core.ArtworkRecommendationProjection;
import com.pictorial.recommendation_service.core.PurchaseHistoryProjection;
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
    @Query("MATCH (u: Comprador {id: $compradorId})-[:BOUGHT]->(obraComprada: Artwork)-[:HAS_GENRE]->(g:Genre) " +
            "WITH u, COLLECT(obraComprada) AS compradas, COLLECT(DISTINCT g) AS generos " +
            "UNWIND generos AS gen " +
            "MATCH (gen)<-[:HAS_GENRE]-(recomendada: Artwork) " +
            "WHERE NOT recomendada IN compradas AND recomendada.status = 'AVAILABLE' " +
            "RETURN DISTINCT recomendada.artworkId AS artworkId, recomendada.name AS obra, " +
            "       gen.name AS genero, toFloat(recomendada.price) AS precio " +
            "ORDER BY precio DESC LIMIT $limit")
    List<ArtworkRecommendationProjection> getRecommendationsBasedOnPurchases(@Param("compradorId") String compradorId, @Param("limit") int limit);

    // 7.3 Historial de compras de un usuario con detalles de artista y género (Proyección tabular)
    @Query("MATCH (u: Comprador {id: $compradorId})-[c:BOUGHT]->(aw: Artwork)<-[:CREATED]-(a: Artist) " +
            "OPTIONAL MATCH (aw)-[:HAS_GENRE]->(g:Genre) " +
            "RETURN u.name AS comprador, aw.name AS obra, (a.name + ' ' + a.lastName) AS artista, g.name AS genero, c.fecha AS fechaCompra")
    List<PurchaseHistoryProjection> getPurchaseHistoryDetails(@Param("compradorId") String compradorId);

    // 7.6 Recomendaciones basadas en todas las obras vistas (SAW)
    @Query("MATCH (u: Comprador {id: $compradorId})-[:SAW]->(obraVista: Artwork)-[:HAS_GENRE]->(g:Genre) " +
            "WITH u, COLLECT(obraVista) AS vistas, COLLECT(DISTINCT g) AS generos " +
            "UNWIND generos AS gen " +
            "MATCH (gen)<-[:HAS_GENRE]-(recomendada: Artwork) " +
            "OPTIONAL MATCH (u)-[b:BOUGHT]->(recomendada) " +
            "WHERE NOT recomendada IN vistas AND recomendada.status = 'AVAILABLE' AND b IS NULL " +
            "RETURN DISTINCT recomendada.artworkId AS artworkId, recomendada.name AS obra, " +
            "       gen.name AS genero, toFloat(recomendada.price) AS precio " +
            "ORDER BY precio DESC LIMIT $limit")
    List<ArtworkRecommendationProjection> getRecommendationsBasedOnViews(@Param("compradorId") String compradorId, @Param("limit") int limit);

    // 7.7 Recomendaciones basadas estrictamente en la ÚLTIMA obra vista
    @Query("MATCH (u: Comprador {id: $compradorId})-[v:SAW]->(ultima: Artwork) " +
            "WITH u, ultima ORDER BY v.fecha DESC LIMIT 1 " +
            "MATCH (ultima)-[:HAS_GENRE]->(g: Genre)<-[:HAS_GENRE]-(recomendada: Artwork) " +
            "OPTIONAL MATCH (u)-[b:BOUGHT]->(recomendada) " +
            "WHERE recomendada.artworkId <> ultima.artworkId AND recomendada.status = 'AVAILABLE' AND b IS NULL " +
            "RETURN recomendada.artworkId AS artworkId, recomendada.name AS obra, " +
            "       g.name AS genero, toFloat(recomendada.price) AS precio " +
            "ORDER BY precio DESC LIMIT $limit")
    List<ArtworkRecommendationProjection> getRecommendationsBasedOnLastViewed(@Param("compradorId") String compradorId, @Param("limit") int limit);

    // Verifica la existencia de un comprador por su id (para validar antes del sync)
    @Query("MATCH (u:Comprador {id: $compradorId}) RETURN count(u) > 0")
    boolean existsByCompradorId(@Param("compradorId") String compradorId);

    // SYNC.1 Registrar compra (relación :BOUGHT). Los nodos deben preexistir (se valida antes):
    // se hace MATCH de Comprador y Artwork; solo la relación se materializa con MERGE.
    @Query("MATCH (u:Comprador {id: $compradorId}) " +
            "MATCH (aw:Artwork {artworkId: $artworkId}) " +
            "MERGE (u)-[r:BOUGHT]->(aw) " +
            "ON CREATE SET r.fecha = datetime($fecha)")
    void syncPurchase(@Param("compradorId") String compradorId,
                      @Param("artworkId") Long artworkId,
                      @Param("fecha") String fecha);

    // SYNC.3 Registrar vista (relación :SAW). Los nodos deben preexistir (se valida antes):
    // se hace MATCH de Comprador y Artwork; solo la relación se materializa con MERGE.
    // La fecha se actualiza en cada vista (SET, no ON CREATE) para que 7.7 (last-viewed)
    // refleje siempre la última vez que el comprador vio la obra.
    @Query("MATCH (u:Comprador {id: $compradorId}) " +
            "MATCH (aw:Artwork {artworkId: $artworkId}) " +
            "MERGE (u)-[r:SAW]->(aw) " +
            "SET r.fecha = datetime($fecha)")
    void syncView(@Param("compradorId") String compradorId,
                  @Param("artworkId") Long artworkId,
                  @Param("fecha") String fecha);

    // SYNC.4 Alta/actualización del comprador. A diferencia de purchase/view, este SÍ crea el
    // nodo de catálogo (:Comprador) con MERGE, porque modela el evento de registro del cliente.
    @Query("MERGE (u:Comprador {id: $compradorId}) " +
            "SET u.name = $name, u.email = $email")
    void syncClient(@Param("compradorId") String compradorId,
                    @Param("name") String name,
                    @Param("email") String email);
}
