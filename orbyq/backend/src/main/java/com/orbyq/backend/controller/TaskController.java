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
        Task task = taskService.createTask(
            userDetails.getUsername(),
            request.get("title"),
            request.get("description"),
            request.get("priority"),
            LocalDate.parse(request.get("dueDate")),
            request.get("status")
        );
        return ResponseEntity.ok(task);
    }

    @PatchMapping("/{taskId}/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> updateTaskStatus(
        @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable String taskId,
        @RequestBody Map<String, String> request
    ) {
        taskService.updateTaskStatus(userDetails.getUsername(), taskId, request.get("status"));
        return ResponseEntity.ok().build();
    }
}