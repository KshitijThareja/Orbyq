package com.orbyq.backend.service;

import com.orbyq.backend.dto.TaskBoardDTO;
import com.orbyq.backend.model.Task;
import com.orbyq.backend.model.User;
import com.orbyq.backend.repository.TaskRepository;
import com.orbyq.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private UserRepository userRepository;

    public TaskBoardDTO getTaskBoard(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        User user = userOpt.get();

        // Fetch tasks by status
        Map<Task.Status, List<Task>> tasksByStatus = new EnumMap<>(Task.Status.class);
        for (Task.Status status : Task.Status.values()) {
            tasksByStatus.put(status, taskRepository.findByUserAndStatus(user, status));
        }

        // Build tasks map
        Map<String, TaskBoardDTO.TaskDTO> tasksMap = new HashMap<>();
        tasksByStatus.values().forEach(tasks -> tasks.forEach(task -> {
            tasksMap.put(task.getId().toString(), new TaskBoardDTO.TaskDTO(
                task.getId().toString(),
                task.getTitle(),
                task.getDescription(),
                task.getPriority().name().toLowerCase(),
                task.getDueDate(),
                task.getComments(),
                task.getAttachments()
            ));
        }));

        // Build columns
        Map<String, TaskBoardDTO.ColumnDTO> columns = new LinkedHashMap<>();
        String[] columnOrder = new String[4];
        int index = 0;

        // Column: To Do
        List<String> todoTaskIds = tasksByStatus.get(Task.Status.TODO).stream()
            .map(task -> task.getId().toString()).collect(Collectors.toList());
        columns.put("column-1", new TaskBoardDTO.ColumnDTO("column-1", "To Do", todoTaskIds.toArray(new String[0])));
        columnOrder[index++] = "column-1";

        // Column: In Progress
        List<String> inProgressTaskIds = tasksByStatus.get(Task.Status.IN_PROGRESS).stream()
            .map(task -> task.getId().toString()).collect(Collectors.toList());
        columns.put("column-2", new TaskBoardDTO.ColumnDTO("column-2", "In Progress", inProgressTaskIds.toArray(new String[0])));
        columnOrder[index++] = "column-2";

        // Column: Review
        List<String> reviewTaskIds = tasksByStatus.get(Task.Status.REVIEW).stream()
            .map(task -> task.getId().toString()).collect(Collectors.toList());
        columns.put("column-3", new TaskBoardDTO.ColumnDTO("column-3", "Review", reviewTaskIds.toArray(new String[0])));
        columnOrder[index++] = "column-3";

        // Column: Done
        List<String> doneTaskIds = tasksByStatus.get(Task.Status.DONE).stream()
            .map(task -> task.getId().toString()).collect(Collectors.toList());
        columns.put("column-4", new TaskBoardDTO.ColumnDTO("column-4", "Done", doneTaskIds.toArray(new String[0])));
        columnOrder[index++] = "column-4";

        // Build DTO
        TaskBoardDTO board = new TaskBoardDTO();
        board.setColumns(columns);
        board.setTasks(tasksMap);
        board.setColumnOrder(columnOrder);

        return board;
    }

    public Task createTask(String email, String title, String description, String priority, LocalDate dueDate, String status) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        User user = userOpt.get();

        Task task = new Task();
        task.setUser(user);
        task.setTitle(title);
        task.setDescription(description);
        task.setPriority(Task.Priority.valueOf(priority.toUpperCase()));
        task.setDueDate(dueDate);
        task.setStatus(Task.Status.valueOf(status.toUpperCase()));
        task.setCompleted(false);
        task.setComments(0);
        task.setAttachments(0);
        task.setCreatedAt(LocalDateTime.now());

        return taskRepository.save(task);
    }

    public void updateTaskStatus(String email, String taskId, String newStatus) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        User user = userOpt.get();

        Optional<Task> taskOpt = taskRepository.findById(UUID.fromString(taskId));
        if (taskOpt.isEmpty() || !taskOpt.get().getUser().equals(user)) {
            throw new RuntimeException("Task not found or unauthorized");
        }
        Task task = taskOpt.get();

        task.setStatus(Task.Status.valueOf(newStatus.toUpperCase()));
        task.setCompleted(newStatus.equalsIgnoreCase("DONE"));
        taskRepository.save(task);
    }
}