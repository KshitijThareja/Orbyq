package com.orbyq.backend.dto;

import java.util.List;

public class CanvasDTO {
    private CanvasInfoDTO canvas;
    private List<CanvasItemDTO> items;

    public static class CanvasInfoDTO {
        private String id;
        private String title;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
    }

    public CanvasDTO() {}

    public CanvasInfoDTO getCanvas() { return canvas; }
    public void setCanvas(CanvasInfoDTO canvas) { this.canvas = canvas; }
    public List<CanvasItemDTO> getItems() { return items; }
    public void setItems(List<CanvasItemDTO> items) { this.items = items; }
}