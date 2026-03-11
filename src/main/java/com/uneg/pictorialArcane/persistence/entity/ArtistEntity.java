package com.uneg.pictorialArcane.persistence.entity;

import com.uneg.pictorialArcane.persistence.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "artist")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
public class ArtistEntity extends AuditableEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_artist")
    private Long idArtist;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "lastName", nullable = false, length = 50)
    private String lastName;

    @Column(name = "nationality", nullable = false, length = 20)
    private String nationality;

    @Column(name = "biography", nullable = false, length = 120)
    private String biography;

    @Column(name = "commission_rate")
    private Double commissionRate;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "birthdate")
    private LocalDate birthdate;

    @OneToMany(mappedBy = "artist", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<ArtWorkEntity> artWorks;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "artist_genre",
            joinColumns = @JoinColumn(name = "id_artist", referencedColumnName = "id_artist"),
            inverseJoinColumns = @JoinColumn(name = "id_genre", referencedColumnName = "id_genre")
    )
    private Set<GenreEntity> genres = new HashSet<>();


    public Double getCommissionRate() {
        return commissionRate;
    }

    public void setCommissionRate(Double commissionRate) {
        this.commissionRate = commissionRate;
    }

    public List<ArtWorkEntity> getArtWorks() {
        return artWorks;
    }

    public void setArtWorks(List<ArtWorkEntity> artWorks) {
        this.artWorks = artWorks;
    }

    public Long getIdArtist() {
        return idArtist;
    }

    public void setIdArtist(Long idArtist) {
        this.idArtist = idArtist;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public String getBiography() {
        return biography;
    }

    public void setBiography(String biography) {
        this.biography = biography;
    }

}
