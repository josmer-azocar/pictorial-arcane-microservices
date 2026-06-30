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
public class BoughtProperties {

    @Id
    @GeneratedValue
    private Long id; // Requerido por SDN para identificar la relación física

    @TargetNode
    private ArtworkNode artwork;

    private ZonedDateTime fecha; // Mapea datetime('2025-01-15')

    public BoughtProperties(ArtworkNode artwork, ZonedDateTime fecha) {
        this.artwork = artwork;
        this.fecha = fecha;
    }
}
