package com.orbyq.backend.controller;

import com.orbyq.backend.model.*;
import com.orbyq.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/export")
public class DataExportController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CanvasRepository canvasRepository;
    
    @Autowired
    private CanvasItemRepository canvasItemRepository;
    
    @Autowired
    private DocumentRepository documentRepository;
    
    @Autowired
    private MoodBoardItemRepository moodBoardItemRepository;
    
    @Autowired
    private TodoRepository todoRepository;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private ActivityLogRepository activityLogRepository;
    
    @Autowired
    private IdeaRepository ideaRepository;

    @GetMapping("/all")
    public ResponseEntity<?> exportAllData() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();
        Map<String, Object> exportData = new HashMap<>();
        
        // Add user data
        exportData.put("user", user);
        
        // Add all related data
        exportData.put("canvases", canvasRepository.findByUser(user));
        exportData.put("canvasItems", canvasItemRepository.findByUser(user));
        exportData.put("documents", documentRepository.findByUser(user));
        exportData.put("moodBoardItems", moodBoardItemRepository.findByUser(user));
        
        // Use Pageable for TodoRepository
        Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE);
        exportData.put("todos", todoRepository.findByUser(user, pageable).getContent());
        
        exportData.put("projects", projectRepository.findByUser(user));
        exportData.put("tasks", taskRepository.findByUser(user));
        exportData.put("activityLogs", activityLogRepository.findTop5ByUserOrderByCreatedAtDesc(user));
        exportData.put("ideas", ideaRepository.findByUser(user));

        return ResponseEntity.ok(exportData);
    }
} 