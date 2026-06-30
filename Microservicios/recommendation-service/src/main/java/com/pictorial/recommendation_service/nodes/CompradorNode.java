package com.pictorial.recommendation_service.nodes;

import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;

@Node("Comprador")
public class CompradorNode {

    @Id
    private String id; // ID alfanumérico string ('user1', 'user2')

    private String name;
    private String email;

    // (Comprador)-[:BOUGHT]->(Artwork)
    @Relationship(type = "BOUGHT", direction = Relationship.Direction.OUTGOING)
    private Set<BoughtProperties> boughtRelations = new HashSet<>();

    // (Comprador)-[:SAW]->(Artwork)
    @Relationship(type = "SAW", direction = Relationship.Direction.OUTGOING)
    private Set<SawProperties> sawRelations = new HashSet<>();

    public CompradorNode() {}

    // Métodos de utilidad para asociar compras y vistas fluidamente en la capa de servicio
    public void registerPurchase(ArtworkNode artwork, ZonedDateTime fecha) {
        this.boughtRelations.add(new BoughtProperties(artwork, fecha));
    }

    public void registerView(ArtworkNode artwork, ZonedDateTime fecha) {
        this.sawRelations.add(new SawProperties(artwork, fecha));
    }

    // Getters y Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Set<BoughtProperties> getBoughtRelations() { return boughtRelations; }
    public void setBoughtRelations(Set<BoughtProperties> boughtRelations) { this.boughtRelations = boughtRelations; }
    public Set<SawProperties> getSawRelations() { return sawRelations; }
    public void setSawRelations(Set<SawProperties> sawRelations) { this.sawRelations = sawRelations; }
}