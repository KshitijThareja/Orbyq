package com.orbyq.backend.controller;

import com.orbyq.backend.model.*;
import com.orbyq.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/import")
public class DataImportController {

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

    @PostMapping("/all")
    public ResponseEntity<?> importAllData(@RequestBody Map<String, Object> importData) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }
        User user = userOpt.get();

        // Import Canvases
        List<Map<String, Object>> canvases = (List<Map<String, Object>>) importData.get("canvases");
        if (canvases != null) {
            for (Map<String, Object> canvasData : canvases) {
                Canvas canvas = new Canvas();
                canvas.setTitle((String) canvasData.get("title"));
                canvas.setUser(user);
                canvasRepository.save(canvas);
            }
        }
        // Import CanvasItems
        List<Map<String, Object>> canvasItems = (List<Map<String, Object>>) importData.get("canvasItems");
        if (canvasItems != null) {
            for (Map<String, Object> itemData : canvasItems) {
                CanvasItem item = new CanvasItem();
                item.setType((String) itemData.get("type"));
                item.setContent((String) itemData.get("content"));
                item.setUser(user);
                canvasItemRepository.save(item);
            }
        }
        // Import Documents
        List<Map<String, Object>> documents = (List<Map<String, Object>>) importData.get("documents");
        if (documents != null) {
            for (Map<String, Object> docData : documents) {
                Document doc = new Document();
                doc.setTitle((String) docData.get("title"));
                doc.setContent((String) docData.get("content"));
                doc.setUser(user);
                documentRepository.save(doc);
            }
        }
        // Import MoodBoardItems
        List<Map<String, Object>> moodBoardItems = (List<Map<String, Object>>) importData.get("moodBoardItems");
        if (moodBoardItems != null) {
            for (Map<String, Object> mbData : moodBoardItems) {
                MoodBoardItem mb = new MoodBoardItem();
                mb.setImageUrl((String) mbData.get("imageUrl"));
                mb.setUser(user);
                moodBoardItemRepository.save(mb);
            }
        }
        // Import Todos
        List<Map<String, Object>> todos = (List<Map<String, Object>>) importData.get("todos");
        if (todos != null) {
            for (Map<String, Object> todoData : todos) {
                Todo todo = new Todo();
                todo.setTitle((String) todoData.get("title"));
                // Optional fields
                if (todoData.get("completed") != null) {
                    todo.setCompleted(Boolean.parseBoolean(todoData.get("completed").toString()));
                }
                if (todoData.get("priority") != null) {
                    try {
                        todo.setPriority(Todo.Priority.valueOf(todoData.get("priority").toString()));
                    } catch (Exception ignored) {}
                }
                if (todoData.get("dueDate") != null) {
                    try {
                        todo.setDueDate(java.time.LocalDate.parse(todoData.get("dueDate").toString()));
                    } catch (Exception ignored) {}
                }
                if (todoData.get("category") != null) {
                    try {
                        todo.setCategory(Todo.Category.valueOf(todoData.get("category").toString()));
                    } catch (Exception ignored) {}
                }
                todo.setUser(user);
                todoRepository.save(todo);
            }
        }
        // Import Projects
        List<Map<String, Object>> projects = (List<Map<String, Object>>) importData.get("projects");
        if (projects != null) {
            for (Map<String, Object> projectData : projects) {
                Project project = new Project();
                project.setName((String) projectData.get("name"));
                project.setUser(user);
                projectRepository.save(project);
            }
        }
        // Import Tasks
        List<Map<String, Object>> tasks = (List<Map<String, Object>>) importData.get("tasks");
        if (tasks != null) {
            for (Map<String, Object> taskData : tasks) {
                Task task = new Task();
                task.setTitle((String) taskData.get("title"));
                task.setDescription((String) taskData.get("description"));
                task.setUser(user);
                taskRepository.save(task);
            }
        }
        // Import ActivityLogs
        List<Map<String, Object>> activityLogs = (List<Map<String, Object>>) importData.get("activityLogs");
        if (activityLogs != null) {
            for (Map<String, Object> logData : activityLogs) {
                ActivityLog log = new ActivityLog();
                log.setAction((String) logData.get("action"));
                log.setUser(user);
                activityLogRepository.save(log);
            }
        }
        // Import Ideas
        List<Map<String, Object>> ideas = (List<Map<String, Object>>) importData.get("ideas");
        if (ideas != null) {
            for (Map<String, Object> ideaData : ideas) {
                Idea idea = new Idea();
                idea.setContent((String) ideaData.get("content"));
                idea.setUser(user);
                ideaRepository.save(idea);
            }
        }
        return ResponseEntity.ok(Map.of("message", "Data imported successfully"));
    }
} 