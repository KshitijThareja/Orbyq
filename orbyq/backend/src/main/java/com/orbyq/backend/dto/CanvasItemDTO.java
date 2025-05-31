package com.orbyq.backend.dto;

public class CanvasItemDTO {
    private String id;
    private String canvasId;
    private String type;
    private String content;
    private double x;
    private double y;
    private double width;
    private double height;
    private StyleDTO style;

    public static class StyleDTO {
        private String fontSize;
        private String fontWeight;
        private String colorClass;
        private String backgroundClass;
        private String padding;
        private String borderRadius;

        public StyleDTO() {}

        public String getFontSize() { return fontSize; }
        public void setFontSize(String fontSize) { this.fontSize = fontSize; }
        public String getFontWeight() { return fontWeight; }
        public void setFontWeight(String fontWeight) { this.fontWeight = fontWeight; }
        public String getColorClass() { return colorClass; }
        public void setColorClass(String colorClass) { this.colorClass = colorClass; }
        public String getBackgroundClass() { return backgroundClass; }
        public void setBackgroundClass(String backgroundClass) { this.backgroundClass = backgroundClass; }
        public String getPadding() { return padding; }
        public void setPadding(String padding) { this.padding = padding; }
        public String getBorderRadius() { return borderRadius; }
        public void setBorderRadius(String borderRadius) { this.borderRadius = borderRadius; }
    }

    public CanvasItemDTO() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCanvasId() { return canvasId; }
    public void setCanvasId(String canvasId) { this.canvasId = canvasId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public double getX() { return x; }
    public void setX(double x) { this.x = x; }
    public double getY() { return y; }
    public void setY(double y) { this.y = y; }
    public double getWidth() { return width; }
    public void setWidth(double width) { this.width = width; }
    public double getHeight() { return height; }
    public void setHeight(double height) { this.height = height; }
    public StyleDTO getStyle() { return style; }
    public void setStyle(StyleDTO style) { this.style = style; }
}