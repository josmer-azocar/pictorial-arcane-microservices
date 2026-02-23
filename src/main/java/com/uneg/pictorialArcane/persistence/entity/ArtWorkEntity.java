package com.uneg.pictorialArcane.persistence.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Inheritance(strategy = InheritanceType.JOINED) //la dice a jpa que use herencia con tablas separadas
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

    @Column(name = "price")
    private double price;

    @ManyToOne(fetch = FetchType.LAZY, targetEntity = ArtistEntity.class)
    @JoinColumn(name = "id_artist", referencedColumnName = "id_artist")
    private ArtistEntity artist; //trae la informacion del artista solo de lectura

    @ManyToOne(targetEntity = GenderEntity.class)
    @JoinColumn(name = "id_gender", referencedColumnName = "id_gender")
    private GenderEntity gender;

    /*//reserva transaccional
    @Version
    @Column(name = "version")
    private Long version; //para evitar las ventas dobles

    @Column(name = "reserved_at")
    private java.time.LocalDateTime reserved_at; //timestamp de la reserva

    @Column(name = "security_code", length = 50)
    private String securityCode; //codigo de la reserva*/

    public ArtWorkEntity(Long idArtWork, String name, String status, double price, ArtistEntity artist, GenderEntity gender) {
        this.idArtWork = idArtWork;
        this.name = name;
        this.status = status;
        this.price = price;
        this.artist = artist;
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

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}
