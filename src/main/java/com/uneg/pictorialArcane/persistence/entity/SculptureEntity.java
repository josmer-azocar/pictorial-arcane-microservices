package com.uneg.pictorialArcane.persistence.entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "sculpture")
@PrimaryKeyJoinColumn(name = "id_artwork")
public class SculptureEntity extends ArtWorkEntity {

    @Column(name = "material", nullable = false, length = 100)
    private String material;

    @Column(name = "weight", nullable = false)
    private Double weight;

    @Column(name = "length", nullable = false)
    private Double length;

    @Column(name = "width", nullable = false)
    private Double width;

    @Column(name = "depth", nullable = false)
    private Double depth;

    public SculptureEntity(Long idArtWork, String name, String status, double price, ArtistEntity artist, GenderEntity gender, String material, Double weight, Double length, Double width, Double depth, List sales) {
        super(idArtWork, name, status, price, artist, gender, sales);
        this.material = material;
        this.weight = weight;
        this.length = length;
        this.width = width;
        this.depth = depth;
    }

    public SculptureEntity() {

    }

    // --- GETTERS Y SETTERS ---

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {this.weight = weight;}

    public Double getLength() {
        return length;
    }

    public void setLength(Double length) {this.length = length;}

    public Double getWidth() {
        return width;
    }

    public void setWidth(Double width) {
        this.width = width;
    }

    public Double getDepth() {
        return depth;
    }

    public void setDepth(Double depth) {
        this.depth = depth;
    }

}