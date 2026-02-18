package com.uneg.pictorialArcane.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "painting")
public class PaintingEntity {
    @Id
    @Column(name = "id")
    private Long id;

    @OneToOne
    @MapsId //mapea el id de Sculpture sea el mismo que el de ArtWork
    @JoinColumn(name = "id_artwork")
    private ArtWorkEntity artWork;

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

    public PaintingEntity(Long id, ArtWorkEntity artWork, String technique, String holder, String style, String framed, Double width, Double height) {
        this.id = id;
        this.artWork = artWork;
        this.technique = technique;
        this.holder = holder;
        this.style = style;
        this.framed = framed;
        this.width = width;
        this.height = height;
    }

    public PaintingEntity() {
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
