package com.uneg.pictorialArcane.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "ceramic")
@PrimaryKeyJoinColumn(name = "id_artwork")
@AllArgsConstructor
@NoArgsConstructor
public class CeramicEntity extends ArtWorkEntity{

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
