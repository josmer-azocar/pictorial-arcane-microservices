package com.pictorial.artwork_service.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Document(collection = "artists")
public class ArtistDocument {

    @Id
    private String id;

    private String name;

    private String lastName;

    private String nationality;

    private String biography;

    private Double commissionRate;

    private String imageUrl;

    private LocalDate birthdate;

    private Set<String> genreIds = new HashSet<>();

    private LocalDateTime createdAt;

    private LocalDateTime modifiedAt;

    public ArtistDocument() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getNationality() { return nationality; }
    public void setNationality(String nationality) { this.nationality = nationality; }
    public String getBiography() { return biography; }
    public void setBiography(String biography) { this.biography = biography; }
    public Double getCommissionRate() { return commissionRate; }
    public void setCommissionRate(Double commissionRate) { this.commissionRate = commissionRate; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public LocalDate getBirthdate() { return birthdate; }
    public void setBirthdate(LocalDate birthdate) { this.birthdate = birthdate; }
    public Set<String> getGenreIds() { return genreIds; }
    public void setGenreIds(Set<String> genreIds) { this.genreIds = genreIds; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getModifiedAt() { return modifiedAt; }
    public void setModifiedAt(LocalDateTime modifiedAt) { this.modifiedAt = modifiedAt; }
}
