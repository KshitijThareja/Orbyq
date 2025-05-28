package com.orbyq.backend.dto;

import com.orbyq.backend.model.Todo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.FutureOrPresent;
import java.time.LocalDate;

public class TodoRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Due date is required")
    @FutureOrPresent(message = "Due date must be today or a future date")
    private LocalDate dueDate;

    @NotNull(message = "Category is required")
    private Todo.Category category;

    @NotNull(message = "Priority is required")
    private Todo.Priority priority;

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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