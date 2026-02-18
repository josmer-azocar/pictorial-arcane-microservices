package com.uneg.pictorialArcane.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "artwork")
public class ArtWorkEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_artwork")
    private Long idArtWork;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "status", nullable = false, length = 15)
    private String status;

    @Column(name = "prize")
    private double prize;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_artist", referencedColumnName = "id_artist")
    private ArtistEntity artist; //trae la informacion del artista solo de lectura

    @Column(name = "id_artist")
    private Long idArtist; //aqui se guarda el id del artista dentro de ArtWork

    @ManyToOne(targetEntity = GenderEntity.class)
    @JoinColumn(name = "id_gender", referencedColumnName = "id_gender")
    private GenderEntity gender;

    public ArtWorkEntity(Long idArtWork, String name, String status, double prize, ArtistEntity artist, Long idArtist, GenderEntity gender) {
        this.idArtWork = idArtWork;
        this.name = name;
        this.status = status;
        this.prize = prize;
        this.artist = artist;
        this.idArtist = idArtist;
        this.gender = gender;
    }
    public ArtWorkEntity() {

    }

    public GenderEntity getGender() {
        return gender;
    }

    public void setGender(GenderEntity gender) {
        this.gender = gender;
    }

    public ArtistEntity getArtist() {
        return artist;
    }

    public void setArtist(ArtistEntity artist) {
        this.artist = artist;
    }

    public Long getIdArtist() {
        return idArtist;
    }

    public void setIdArtist(Long idArtist) {
        this.idArtist = idArtist;
    }

    public Long getIdArtWork() {
        return idArtWork;
    }

    public void setIdArtWork(Long idArtWork) {
        this.idArtWork = idArtWork;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public double getPrize() {
        return prize;
    }

    public void setPrize(double prize) {
        this.prize = prize;
    }
}
