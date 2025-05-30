package com.orbyq.backend.controller;

import com.orbyq.backend.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

    @Autowired
    private TodoService todoService;

    @GetMapping
    public TodoService.PaginatedTodosDTO getTodos(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection,
            @RequestParam(required = false) Boolean completed,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String category
    ) {
        String username = authentication.getName();
        return todoService.getTodos(username, page, size, sortBy, sortDirection, completed, priority, category);
    }

    @PostMapping
    public void addTodo(
            @RequestBody TodoRequest todoRequest,
            Authentication authentication
    ) {
        String username = authentication.getName();
        todoService.addTodo(
                username,
                todoRequest.title,
                todoRequest.priority,
                todoRequest.dueDate,
                todoRequest.category
        );
    }

    @PutMapping("/{todoId}/complete")
    public void updateTodoCompletion(
            @PathVariable String todoId,
            @RequestBody CompletionRequest completionRequest,
            Authentication authentication
    ) {
        String username = authentication.getName();
        todoService.updateTodoCompletion(username, todoId, completionRequest.completed);
    }

    @PutMapping("/{todoId}")
    public void updateTodo(
            @PathVariable String todoId,
            @RequestBody TodoRequest todoRequest,
            Authentication authentication
    ) {
        String username = authentication.getName();
        todoService.updateTodo(
                username,
                todoId,
                todoRequest.title,
                todoRequest.priority,
                todoRequest.dueDate,
                todoRequest.category
        );
    }

    @DeleteMapping("/{todoId}")
    public void deleteTodo(
            @PathVariable String todoId,
            Authentication authentication
    ) {
        String username = authentication.getName();
        todoService.deleteTodo(username, todoId);
    }

    public static class TodoRequest {
        private String title;
        private String priority;
        private String dueDate;
        private String category;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getPriority() { return priority; }
        public void setPriority(String priority) { this.priority = priority; }
        public String getDueDate() { return dueDate; }
        public void setDueDate(String dueDate) { this.dueDate = dueDate; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
    }

    public static class CompletionRequest {
        private boolean completed;

        public boolean isCompleted() { return completed; }
        public void setCompleted(boolean completed) { this.completed = completed; }
    }
}