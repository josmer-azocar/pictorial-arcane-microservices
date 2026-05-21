package com.pictorial.artwork_service.document;

public class CeramicDocument extends ArtWorkDocument {

    private String materialType;
    private String technique;
    private String finish;
    private Double cookingTemperature;
    private Double weight;
    private Double width;
    private Double height;

    public CeramicDocument() {}

    public String getMaterialType() { return materialType; }
    public void setMaterialType(String materialType) { this.materialType = materialType; }
    public String getTechnique() { return technique; }
    public void setTechnique(String technique) { this.technique = technique; }
    public String getFinish() { return finish; }
    public void setFinish(String finish) { this.finish = finish; }
    public Double getCookingTemperature() { return cookingTemperature; }
    public void setCookingTemperature(Double cookingTemperature) { this.cookingTemperature = cookingTemperature; }
    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }
    public Double getWidth() { return width; }
    public void setWidth(Double width) { this.width = width; }
    public Double getHeight() { return height; }
    public void setHeight(Double height) { this.height = height; }
}
