package com.orbyq.backend.service;

import com.orbyq.backend.dto.TaskBoardDTO;
import com.orbyq.backend.model.Task;
import com.orbyq.backend.model.User;
import com.orbyq.backend.repository.TaskRepository;
import com.orbyq.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    public TaskBoardDTO getTaskBoard(String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<Task> tasks = taskRepository.findByUser(user);
        Map<String, TaskBoardDTO.TaskDTO> taskMap = new HashMap<>();
        for (Task task : tasks) {
            TaskBoardDTO.TaskDTO taskDTO = new TaskBoardDTO.TaskDTO(
                task.getId().toString(),
                task.getTitle(),
                task.getDescription(),
                task.getPriority().toString().toLowerCase(),
                task.getDueDate().toString(),
                task.getStatus().toString(),
                task.getComments(),
                task.getAttachments()
            );
            taskMap.put(task.getId().toString(), taskDTO);
        }

        Map<String, TaskBoardDTO.ColumnDTO> columns = new HashMap<>();
        String[] columnOrder = new String[]{"column-1", "column-2", "column-3", "column-4"};

        Map<Task.Status, List<String>> tasksByStatus = tasks.stream()
                .collect(Collectors.groupingBy(
                        Task::getStatus,
                        Collectors.mapping(task -> task.getId().toString(), Collectors.toList())
                ));

        TaskBoardDTO.ColumnDTO todoColumn = new TaskBoardDTO.ColumnDTO(
            "column-1",
            "To Do",
            tasksByStatus.getOrDefault(Task.Status.TODO, Arrays.asList()).toArray(new String[0])
        );
        columns.put("column-1", todoColumn);

        TaskBoardDTO.ColumnDTO inProgressColumn = new TaskBoardDTO.ColumnDTO(
            "column-2",
            "In Progress",
            tasksByStatus.getOrDefault(Task.Status.IN_PROGRESS, Arrays.asList()).toArray(new String[0])
        );
        columns.put("column-2", inProgressColumn);

        TaskBoardDTO.ColumnDTO reviewColumn = new TaskBoardDTO.ColumnDTO(
            "column-3",
            "Review",
            tasksByStatus.getOrDefault(Task.Status.REVIEW, Arrays.asList()).toArray(new String[0])
        );
        columns.put("column-3", reviewColumn);

        TaskBoardDTO.ColumnDTO doneColumn = new TaskBoardDTO.ColumnDTO(
            "column-4",
            "Done",
            tasksByStatus.getOrDefault(Task.Status.DONE, Arrays.asList()).toArray(new String[0])
        );
        columns.put("column-4", doneColumn);

        TaskBoardDTO taskBoard = new TaskBoardDTO();
        taskBoard.setColumns(columns);
        taskBoard.setTasks(taskMap);
        taskBoard.setColumnOrder(columnOrder);
        return taskBoard;
    }

    public Task createTask(String username, String title, String description, String priority, LocalDate dueDate, String status) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Task task = new Task();
        task.setUser(user);
        task.setTitle(title);
        task.setDescription(description);
        task.setPriority(Task.Priority.valueOf(priority.toUpperCase()));
        task.setDueDate(dueDate);
        task.setStatus(Task.Status.valueOf(status));
        task.setCreatedAt(LocalDate.now());
        task.setCompleted(false);
        task.setComments(0);
        task.setAttachments(0);
        task.setVersion(0L);

        return taskRepository.save(task);
    }

    public void updateTask(String username, String taskId, String title, String description, String priority, LocalDate dueDate, String status) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Task task = taskRepository.findById(UUID.fromString(taskId))
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to update this task");
        }

        task.setTitle(title);
        task.setDescription(description);
        task.setPriority(Task.Priority.valueOf(priority.toUpperCase()));
        task.setDueDate(dueDate);
        task.setStatus(Task.Status.valueOf(status));
        taskRepository.save(task);
    }

    public void deleteTask(String username, String taskId) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Task task = taskRepository.findById(UUID.fromString(taskId))
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to delete this task");
        }

        taskRepository.delete(task);
    }

    public void updateTaskStatus(String username, String taskId, String status) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Task task = taskRepository.findById(UUID.fromString(taskId))
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to update this task");
        }

        task.setStatus(Task.Status.valueOf(status));
        taskRepository.save(task);
    }
}