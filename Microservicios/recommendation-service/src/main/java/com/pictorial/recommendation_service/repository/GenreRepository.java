package com.pictorial.recommendation_service.repository;
import com.pictorial.recommendation_service.nodes.GenreNode;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GenreRepository extends Neo4jRepository<GenreNode, Long> {


}
