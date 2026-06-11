package com.pictorial.artwork_service.document;

public class PhotographyDocument {

    private String printType;
    private String resolution;
    private String color;
    private String serialNumber;
    private String camera;

    public PhotographyDocument() {}

    public String getPrintType() { return printType; }
    public void setPrintType(String printType) { this.printType = printType; }
    public String getResolution() { return resolution; }
    public void setResolution(String resolution) { this.resolution = resolution; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }
    public String getCamera() { return camera; }
    public void setCamera(String camera) { this.camera = camera; }
}
