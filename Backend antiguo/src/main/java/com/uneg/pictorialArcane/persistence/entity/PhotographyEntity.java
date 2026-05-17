package com.uneg.pictorialArcane.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "photography")
@PrimaryKeyJoinColumn(name = "id_artwork")
@AllArgsConstructor
@NoArgsConstructor
public class PhotographyEntity extends ArtWorkEntity{

    @Column(name = "print_type", length = 15)
    private String printType;

    @Column(name = "resolution", length = 15)
    private String resolution;

    @Column(name = "color", length = 15)
    private String color;

    @Column(name = "serial_number", length = 25)
    private String serialNumber;

    @Column(name = "camera", length = 15)
    private String camera;


    public String getPrintType() {
        return printType;
    }

    public void setPrintType(String printType) {
        this.printType = printType;
    }

    public String getResolution() {
        return resolution;
    }

    public void setResolution(String resolution) {
        this.resolution = resolution;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public String getCamera() {
        return camera;
    }

    public void setCamera(String camera) {
        this.camera = camera;
    }
}
