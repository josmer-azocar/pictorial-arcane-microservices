package com.uneg.pictorialArcane.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "sculpture")
@PrimaryKeyJoinColumn(name = "id_artwork")
@AllArgsConstructor
@NoArgsConstructor
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