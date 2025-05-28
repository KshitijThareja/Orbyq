package com.orbyq.backend.dto;

import com.orbyq.backend.model.Todo;
import java.time.LocalDate;

public class TodoResponse {
    private Long id;
    private String title;
    private boolean completed;
    private LocalDate dueDate;
    private Todo.Category category;
    private Todo.Priority priority;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public Todo.Category getCategory() {
        return category;
    }

    public void setCategory(Todo.Category category) {
        this.category = category;
    }

    public Todo.Priority getPriority() {
        return priority;
    }

    public void setPriority(Todo.Priority priority) {
        this.priority = priority;
    }
}