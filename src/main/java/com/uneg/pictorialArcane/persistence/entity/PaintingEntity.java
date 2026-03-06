package com.uneg.pictorialArcane.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "painting")
@PrimaryKeyJoinColumn(name = "id_artwork")
@AllArgsConstructor
@NoArgsConstructor
public class PaintingEntity extends ArtWorkEntity {

    @Column(name = "technique", length = 15)
    private String technique;

    @Column(name = "holder", length = 15)
    private String holder;

    @Column(name = "style", length = 15)
    private String style;

    @Column(name = "framed", length = 5)
    private String framed; // (Yes/no)

    @Column(name = "width", nullable = false)
    private Double width;

    @Column(name = "height", nullable = false)
    private Double height;


    public String getTechnique() {
        return technique;
    }

    public void setTechnique(String technique) {
        this.technique = technique;
    }

    public String getHolder() {
        return holder;
    }

    public void setHolder(String holder) {
        this.holder = holder;
    }

    public String getStyle() {
        return style;
    }

    public void setStyle(String style) {
        this.style = style;
    }

    public String getFramed() {
        return framed;
    }

    public void setFramed(String framed) {
        this.framed = framed;
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
