package com.orbyq.backend.dto;

import java.time.LocalDate;

public class MoodBoardItemDTO {
    private String id;
    private String imageUrl;
    private LocalDate createdAt;

    public MoodBoardItemDTO() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public LocalDate getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }
}