package com.orbyq.backend.controller;

import com.orbyq.backend.dto.TodoRequest;
import com.orbyq.backend.dto.TodoResponse;
import com.orbyq.backend.model.Todo;
import com.orbyq.backend.model.User;
import com.orbyq.backend.service.TodoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Arrays;

@RestController
@RequestMapping("/api/todos")
public class TodoController {
    private final TodoService todoService;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @GetMapping("/options")
    public ResponseEntity<Map<String, Object>> getTodoOptions() {
        return ResponseEntity.ok(Map.of(
            "categories", Arrays.asList(Todo.Category.values()),
            "priorities", Arrays.asList(Todo.Priority.values())
        ));
    }

    @PostMapping
    public ResponseEntity<TodoResponse> createTodo(
            @Valid @RequestBody TodoRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(todoService.createTodo(request, currentUser));
    }

    // ... existing code ...
}