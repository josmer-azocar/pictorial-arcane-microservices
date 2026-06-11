package com.pictorial.artwork_service.document;

public class PaintingDocument {

    private String technique;
    private String holder;
    private String style;
    private String framed;
    private Double width;
    private Double height;

    public PaintingDocument() {}

    public String getTechnique() { return technique; }
    public void setTechnique(String technique) { this.technique = technique; }
    public String getHolder() { return holder; }
    public void setHolder(String holder) { this.holder = holder; }
    public String getStyle() { return style; }
    public void setStyle(String style) { this.style = style; }
    public String getFramed() { return framed; }
    public void setFramed(String framed) { this.framed = framed; }
    public Double getWidth() { return width; }
    public void setWidth(Double width) { this.width = width; }
    public Double getHeight() { return height; }
    public void setHeight(Double height) { this.height = height; }
}
