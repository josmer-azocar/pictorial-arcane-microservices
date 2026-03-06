package com.uneg.pictorialArcane.persistence.entity;

import com.uneg.pictorialArcane.persistence.audit.AuditableEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.JOINED) //la dice a jpa que use herencia con tablas separadas
@Table(name = "artwork")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public class ArtWorkEntity extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_artwork")
    private Long idArtWork;

    @Column(name = "name", nullable = false, length = 100, unique = true)
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

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @OneToMany(mappedBy = "artWork")
    private List<SaleEntity> sales;


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
