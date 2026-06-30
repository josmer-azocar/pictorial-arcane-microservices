package com.pictorial.recommendation_service.nodes;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.RelationshipProperties;
import org.springframework.data.neo4j.core.schema.TargetNode;
import java.time.ZonedDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@RelationshipProperties
public class SawProperties {

    @Id
    @GeneratedValue
    private Long id;

    @TargetNode
    private ArtworkNode artwork;

    private ZonedDateTime fecha; // Mapea datetime('2025-04-01')

    public SawProperties(ArtworkNode artwork, ZonedDateTime fecha) {
        this.artwork = artwork;
        this.fecha = fecha;
    }
}
