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

    public TimelineDTO getTimelineData(String username, String statusFilter, String priorityFilter) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<Project> projects = projectRepository.findByUser(user);
        List<TimelineDTO.ProjectDTO> projectDTOs = new ArrayList<>();

        String[] colors = {"bg-category-work", "bg-category-personal", "bg-category-learning", "bg-priority-high", "bg-priority-medium"};
        int colorIndex = 0;

        Map<String, Double> projectProgress = new HashMap<>();

        for (Project project : projects) {
            List<Task> tasks = taskRepository.findByProject(project);

            if (statusFilter != null && !statusFilter.isEmpty()) {
                tasks = tasks.stream()
                    .filter(task -> task.getStatus().toString().equals(statusFilter))
                    .collect(Collectors.toList());
            }
            if (priorityFilter != null && !priorityFilter.isEmpty()) {
                tasks = tasks.stream()
                    .filter(task -> task.getPriority().toString().equals(priorityFilter))
                    .collect(Collectors.toList());
            }

            List<TimelineDTO.TaskDTO> taskDTOs = tasks.stream().map(task -> {
                LocalDate startDay = task.getCreatedAt() != null ? task.getCreatedAt() : LocalDate.now();
                LocalDate endDay = task.getDueDate() != null ? task.getDueDate() : startDay.plusDays(1);
                long duration = ChronoUnit.DAYS.between(startDay, endDay);
                if (duration < 1) duration = 1;

                return new TimelineDTO.TaskDTO(
                    task.getId().toString(),
                    task.getTitle(),
                    startDay.toString(),
                    (int) duration,
                    task.isCompleted()
                );
            }).collect(Collectors.toList());

            long totalTasks = taskRepository.findByProject(project).size();
            long completedTasks = taskRepository.findByProject(project).stream()
                .filter(Task::isCompleted)
                .count();
            double progress = totalTasks > 0 ? (completedTasks * 100.0 / totalTasks) : 0.0;
            projectProgress.put(project.getId().toString(), progress);

            String projectColor = project.getColor() != null ? project.getColor() : colors[colorIndex % colors.length];
            projectDTOs.add(new TimelineDTO.ProjectDTO(
                project.getId().toString(),
                project.getName(),
                projectColor,
                taskDTOs
            ));
            colorIndex++;
        }

        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(30);
        List<Task> upcomingTasks = taskRepository.findByUserAndDueDateBetween(user, today, endDate);
        if (statusFilter != null && !statusFilter.isEmpty()) {
            upcomingTasks = upcomingTasks.stream()
                .filter(task -> task.getStatus().toString().equals(statusFilter))
                .collect(Collectors.toList());
        }
        if (priorityFilter != null && !priorityFilter.isEmpty()) {
            upcomingTasks = upcomingTasks.stream()
                .filter(task -> task.getPriority().toString().equals(priorityFilter))
                .collect(Collectors.toList());
        }

        List<TimelineDTO.MilestoneDTO> milestones = upcomingTasks.stream()
                .filter(task -> task.getProject() != null)
                .map(task -> new TimelineDTO.MilestoneDTO(
                    task.getTitle(),
                    task.getProject().getName(),
                    task.getDueDate().toString()
                ))
                .limit(5)
                .collect(Collectors.toList());

        TimelineDTO timelineDTO = new TimelineDTO();
        timelineDTO.setProjects(projectDTOs);
        timelineDTO.setUpcomingMilestones(milestones);
        timelineDTO.setProjectProgress(projectProgress);

        return timelineDTO;
    }

    public void addTask(String username, String title, String description, String priority, String projectId, String startDay, int duration) {
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
        task.setDescription(description != null ? description : "");
        task.setPriority(Task.Priority.valueOf(priority.toUpperCase()));
        task.setCreatedAt(createdAt);
        task.setDueDate(dueDate);
        task.setStatus(Task.Status.TODO);
        task.setCompleted(false);
        task.setCompletedAt(null);
        task.setComments(0);
        task.setAttachments(0);
        task.setVersion(0L);

        taskRepository.save(task);
    }

    public void updateProjectColor(String username, String projectId, String color) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Project project = projectRepository.findById(java.util.UUID.fromString(projectId))
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        if (!project.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to update this project");
        }

        project.setColor(color);
        projectRepository.save(project);
    }

    public void createProject(String username, String name, String color) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Project project = new Project();
        project.setUser(user);
        project.setName(name);
        project.setColor(color != null ? color : "bg-category-work"); // Default color if none provided
        project.setVersion(0L);

        projectRepository.save(project);
    }
}