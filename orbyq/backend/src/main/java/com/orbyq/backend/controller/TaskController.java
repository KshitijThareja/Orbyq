package com.orbyq.backend.controller;

import com.orbyq.backend.dto.TaskBoardDTO;
import com.orbyq.backend.model.Task;
import com.orbyq.backend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/taskboard")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public TaskBoardDTO getTaskBoard(@AuthenticationPrincipal UserDetails userDetails) {
        return taskService.getTaskBoard(userDetails.getUsername());
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Task> createTask(
        @AuthenticationPrincipal UserDetails userDetails,
        @RequestBody Map<String, String> request
    ) {
        // Validate that taskId is not present in the request
        if (request.containsKey("taskId")) {
            throw new IllegalArgumentException("taskId should not be provided in a create request. Use PUT to update an existing task.");
        }

        // Validate required fields
        if (!request.containsKey("title") || request.get("title") == null || request.get("title").trim().isEmpty()) {
            throw new IllegalArgumentException("Title is required");
        }
        if (!request.containsKey("status") || request.get("status") == null || request.get("status").trim().isEmpty()) {
            throw new IllegalArgumentException("Status is required");
        }
        if (!request.containsKey("dueDate") || request.get("dueDate") == null || request.get("dueDate").trim().isEmpty()) {
            throw new IllegalArgumentException("Due date is required");
        }

        // Validate due date is not in the past (current date: May 28, 2025)
        LocalDate dueDate = LocalDate.parse(request.get("dueDate"));
        LocalDate currentDate = LocalDate.now(); // May 28, 2025
        if (dueDate.isBefore(currentDate)) {
            throw new IllegalArgumentException("Due date cannot be in the past");
        }

        Task task = taskService.createTask(
            userDetails.getUsername(),
            request.get("title"),
            request.get("description"),
            request.get("priority"),
            dueDate,
            request.get("status")
        );
        return ResponseEntity.ok(task);
    }

    @PutMapping("/{taskId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> updateTask(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable String taskId,
        @RequestBody Map<String, String> request
    ) {
        // Validate required fields
        if (!request.containsKey("title") || request.get("title") == null || request.get("title").trim().isEmpty()) {
            throw new IllegalArgumentException("Title is required");
        }
        if (!request.containsKey("status") || request.get("status") == null || request.get("status").trim().isEmpty()) {
            throw new IllegalArgumentException("Status is required");
        }
        if (!request.containsKey("dueDate") || request.get("dueDate") == null || request.get("dueDate").trim().isEmpty()) {
            throw new IllegalArgumentException("Due date is required");
        }

        // Validate due date is not in the past
        LocalDate dueDate = LocalDate.parse(request.get("dueDate"));
        LocalDate currentDate = LocalDate.now(); // May 28, 2025
        if (dueDate.isBefore(currentDate)) {
            throw new IllegalArgumentException("Due date cannot be in the past");
        }

        taskService.updateTask(
            userDetails.getUsername(),
            taskId,
            request.get("title"),
            request.get("description"),
            request.get("priority"),
            dueDate,
            request.get("status")
        );
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{taskId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteTask(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable String taskId
    ) {
        taskService.deleteTask(userDetails.getUsername(), taskId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{taskId}/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> updateTaskStatus(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable String taskId,
        @RequestBody Map<String, String> request
    ) {
        if (!request.containsKey("status") || request.get("status") == null || request.get("status").trim().isEmpty()) {
            throw new IllegalArgumentException("Status is required");
        }

        taskService.updateTaskStatus(userDetails.getUsername(), taskId, request.get("status"));
        return ResponseEntity.ok().build();
    }
}