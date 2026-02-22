package com.uneg.pictorialArcane.persistence.entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "gender")
public class GenderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_gender", nullable = false)
    private Long idGender;

    @Column(name = "name", nullable = false, length = 15)
    private String name;

    @Column(name = "description", nullable = false, length = 120)
    private String description;

    @OneToMany(mappedBy = "gender", cascade = CascadeType.ALL)
    private List<ArtWorkEntity> artWorkEntities;

    public GenderEntity(Long idGender, String name, String description, List<ArtWorkEntity> artWorkEntities) {
        this.idGender = idGender;
        this.name = name;
        this.description = description;
        this.artWorkEntities = artWorkEntities;
    }

    public GenderEntity() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<ArtWorkEntity> getArtWorkEntities() {
        return artWorkEntities;
    }

    public void setArtWorkEntities(List<ArtWorkEntity> artWorkEntities) {
        this.artWorkEntities = artWorkEntities;
    }

    public Long getIdGender() {
        return idGender;
    }

    public void setIdGender(Long idGender) {
        this.idGender = idGender;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


}