package com.uneg.pictorialArcane.persistence.entity;

import com.uneg.pictorialArcane.persistence.audit.AuditableEntity;
import jakarta.persistence.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.List;

@Entity
@Table(name = "genre")
@EntityListeners(AuditingEntityListener.class)
public class GenreEntity extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_genre", nullable = false)
    private Long idGenre;

    @Column(name = "name", nullable = false, length = 15, unique = true)
    private String name;

    @Column(name = "description", nullable = false, length = 120)
    private String description;

    @OneToMany(mappedBy = "genre", cascade = CascadeType.ALL)
    private List<ArtWorkEntity> artWorkEntities;

    public GenreEntity(Long idGenre, String name, String description, List<ArtWorkEntity> artWorkEntities) {
        this.idGenre = idGenre;
        this.name = name;
        this.description = description;
        this.artWorkEntities = artWorkEntities;
    }

    public GenreEntity() {
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

    public Long getIdGenre() {
        return idGenre;
    }

    public void setIdGenre(Long idGenre) {
        this.idGenre = idGenre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


}