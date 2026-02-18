package com.uneg.pictorialArcane.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ceramic")
public class CeramicEntity {
    @Id
    @Column(name = "id")
    private Long id;

    @OneToOne
    @MapsId //mapea el id de Sculpture sea el mismo que el de ArtWork
    @JoinColumn(name = "id_artwork")
    private ArtWorkEntity artWork;

    @Column(name = "material_type", length = 15)
    private String materialType;

    @Column(name = "technique", length = 15)
    private String technique;

    @Column(name = "finish", length = 15)
    private String finish;

    @Column(name = "cooking_temperature")
    private Double cookingTemperature;

    @Column(name = "weight", nullable = false)
    private Double weight;

    @Column(name = "width", nullable = false)
    private Double width;

    @Column(name = "height", nullable = false)
    private Double height;

    public CeramicEntity() {
    }

    public CeramicEntity(Long id, ArtWorkEntity artWork, String materialType, String technique, String finish, Double cookingTemperature, Double weight, Double width, Double height) {
        this.id = id;
        this.artWork = artWork;
        this.materialType = materialType;
        this.technique = technique;
        this.finish = finish;
        this.cookingTemperature = cookingTemperature;
        this.weight = weight;
        this.width = width;
        this.height = height;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ArtWorkEntity getArtWork() {
        return artWork;
    }

    public void setArtWork(ArtWorkEntity artWork) {
        this.artWork = artWork;
    }

    public String getMaterialType() {
        return materialType;
    }

    public void setMaterialType(String materialType) {
        this.materialType = materialType;
    }

    public String getTechnique() {
        return technique;
    }

    public void setTechnique(String technique) {
        this.technique = technique;
    }

    public String getFinish() {
        return finish;
    }

    public void setFinish(String finish) {
        this.finish = finish;
    }

    public Double getCookingTemperature() {
        return cookingTemperature;
    }

    public void setCookingTemperature(Double cookingTemperature) {
        this.cookingTemperature = cookingTemperature;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public Double getWidth() {
        return width;
    }

    public void setWidth(Double width) {
        this.width = width;
    }

    public Double getHeight() {
        return height;
    }

    public void setHeight(Double height) {
        this.height = height;
    }
}
