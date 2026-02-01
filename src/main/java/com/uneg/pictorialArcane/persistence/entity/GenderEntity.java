package com.uneg.pictorialArcane.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "gender")

public class GenderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_gender")
    private Long idGender;

    @Column(name = "description", nullable = false, length = 120)
    private String description;


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