package com.pictorial.recommendation_service.nodes;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Node("Genre")
public class GenreNode {

    @Id
    private Long id; // ID explícito numérico del script (0, 2, 4...)

    private String name;
    private String description;

}