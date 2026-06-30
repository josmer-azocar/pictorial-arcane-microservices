package com.pictorial.recommendation_service.nodes;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import java.util.HashSet;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Node("Artist")
public class ArtistNode {

    @Id
    private Long id; // ID numérico asignado (0, 13...)

    private String name;
    private String lastName;
    private String nationality;
    private String biography;
    private Double commissionRate;
    private String imageUrl;
    private String birthdate; // Se puede usar String o LocalDate ('1944-09-04')

    // Relación visualizada en el diagrama (Artist)-[:SPECIALIZES_IN]->(Genre)
    @Relationship(type = "SPECIALIZES_IN", direction = Relationship.Direction.OUTGOING)
    private Set<GenreNode> specializedGenres = new HashSet<>();
}
