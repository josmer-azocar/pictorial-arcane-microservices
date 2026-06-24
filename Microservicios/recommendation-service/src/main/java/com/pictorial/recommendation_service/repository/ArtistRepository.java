package com.pictorial.recommendation_service.repository;

import com.pictorial.recommendation_service.nodes.ArtistNode;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ArtistRepository extends Neo4jRepository<ArtistNode, Long> {

    // 7.5 Artistas más populares por cantidad de obras compradas
    @Query("MATCH (a: Artist)-[:CREATED]->(aw: Artwork)<-[:BOUGHT]-(:Comprador) " +
            "RETURN a " +
            "ORDER BY COUNT(aw) DESC LIMIT 5")
    List<ArtistNode> findTop5PopularArtists();
}