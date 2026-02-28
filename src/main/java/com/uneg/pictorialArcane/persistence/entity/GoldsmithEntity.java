package com.uneg.pictorialArcane.persistence.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

import java.util.List;

@Entity
@Table(name = "goldsmith")
@PrimaryKeyJoinColumn(name = "id_artwork")
public class GoldsmithEntity extends ArtWorkEntity{

    @Column(name = "material", length = 15)
    private String material;

    @Column(name = "precious_stones", length = 15)
    private String preciousStones;

    @Column(name = "weight")
    private Double weight;

    public GoldsmithEntity(Long idArtWork, String name, String status, double price, ArtistEntity artist, GenderEntity gender, String material, String preciousStones, Double weight, List sales) {
        super(idArtWork, name, status, price, artist, gender, sales);
        this.material = material;
        this.preciousStones = preciousStones;
        this.weight = weight;
    }
    public GoldsmithEntity() {}

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public String getPreciousStones() {
        return preciousStones;
    }

    public void setPreciousStones(String preciousStones) {
        this.preciousStones = preciousStones;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }
}
