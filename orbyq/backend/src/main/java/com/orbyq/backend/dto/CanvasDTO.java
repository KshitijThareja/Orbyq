package com.orbyq.backend.dto;

import java.util.List;

public class CanvasDTO {
    private List<CanvasItemDTO> items;

    public CanvasDTO() {}

    public List<CanvasItemDTO> getItems() { return items; }
    public void setItems(List<CanvasItemDTO> items) { this.items = items; }
}
