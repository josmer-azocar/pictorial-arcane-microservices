package com.pictorial.recommendation_service.nodes;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Node("Artwork")
public class ArtworkNode {

    @Id
    private Long artworkId; // Clave primaria de negocio usada en los MATCH (1 al 1000)

    private String name;
    private String status; // 'AVAILABLE'
    private Double price;  // 3200, 4500...
    private String imageUrl;

    // (Artwork)-[:HAS_GENRE]->(Genre)
    @Relationship(type = "HAS_GENRE", direction = Relationship.Direction.OUTGOING)
    private GenreNode genre;

    // (Artist)-[:CREATED]->(Artwork) -> Entrante a la obra
    @Relationship(type = "CREATED", direction = Relationship.Direction.INCOMING)
    private ArtistNode artist;

}
