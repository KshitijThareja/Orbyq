package com.orbyq.backend.service;

import com.orbyq.backend.dto.TimelineDTO;
import com.orbyq.backend.model.Task;
import com.orbyq.backend.model.Project;
import com.orbyq.backend.model.User;
import com.orbyq.backend.repository.TaskRepository;
import com.orbyq.backend.repository.ProjectRepository;
import com.orbyq.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TimelineService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    public TimelineDTO getTimelineData(String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Fetch all projects for the user
        List<Project> projects = projectRepository.findByUser(user);
        List<TimelineDTO.ProjectDTO> projectDTOs = new ArrayList<>();

        // Colors for projects (cycling through a few predefined colors)
        String[] colors = {"bg-category-work", "bg-category-personal", "bg-category-learning", "bg-priority-high", "bg-priority-medium"};
        int colorIndex = 0;

        // Map to store project progress
        Map<String, Double> projectProgress = new HashMap<>();

        // Fetch tasks and organize them by project
        for (Project project : projects) {
            List<Task> tasks = taskRepository.findByProject(project);
            List<TimelineDTO.TaskDTO> taskDTOs = tasks.stream().map(task -> {
                // Calculate startDay as createdAt and duration as days between createdAt and dueDate
                LocalDate startDay = task.getCreatedAt() != null ? task.getCreatedAt() : LocalDate.now();
                LocalDate endDay = task.getDueDate() != null ? task.getDueDate() : startDay.plusDays(1);
                long duration = ChronoUnit.DAYS.between(startDay, endDay);
                if (duration < 1) duration = 1; // Minimum duration of 1 day

                return new TimelineDTO.TaskDTO(
                    task.getId().toString(),
                    task.getTitle(),
                    startDay.toString(),
                    (int) duration,
                    task.isCompleted()
                );
            }).collect(Collectors.toList());

            // Calculate project progress
            long totalTasks = tasks.size();
            long completedTasks = tasks.stream().filter(Task::isCompleted).count();
            double progress = totalTasks > 0 ? (completedTasks * 100.0 / totalTasks) : 0.0;
            projectProgress.put(project.getId().toString(), progress);

            projectDTOs.add(new TimelineDTO.ProjectDTO(
                project.getId().toString(),
                project.getName(),
                colors[colorIndex % colors.length],
                taskDTOs
            ));
            colorIndex++;
        }

        // Fetch upcoming milestones (tasks due within the next 30 days)
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(30);
        List<Task> upcomingTasks = taskRepository.findByUserAndDueDateBetween(user, today, endDate);
        List<TimelineDTO.MilestoneDTO> milestones = upcomingTasks.stream()
                .filter(task -> task.getProject() != null) // Only tasks associated with a project
                .map(task -> new TimelineDTO.MilestoneDTO(
                    task.getTitle(),
                    task.getProject().getName(),
                    task.getDueDate().toString()
                ))
                .limit(5) // Limit to 5 milestones
                .collect(Collectors.toList());

        // Build the DTO
        TimelineDTO timelineDTO = new TimelineDTO();
        timelineDTO.setProjects(projectDTOs);
        timelineDTO.setUpcomingMilestones(milestones);
        timelineDTO.setProjectProgress(projectProgress);

        return timelineDTO;
    }

    public void addTask(String username, String title, String projectId, String startDay, int duration) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Project project = projectRepository.findById(java.util.UUID.fromString(projectId))
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        if (!project.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to add task to this project");
        }

        LocalDate createdAt = LocalDate.parse(startDay);
        LocalDate dueDate = createdAt.plusDays(duration - 1);

        Task task = new Task();
        task.setUser(user);
        task.setProject(project);
        task.setTitle(title);
        task.setDescription(""); // Default empty description
        task.setPriority(Task.Priority.MEDIUM); // Default priority
        task.setCreatedAt(createdAt);
        task.setDueDate(dueDate);
        task.setStatus(Task.Status.TODO); // Default status
        task.setCompleted(false);
        task.setCompletedAt(null);
        task.setComments(0);
        task.setAttachments(0);
        task.setVersion(0L);

        taskRepository.save(task);
    }
}