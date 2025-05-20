package com.orbyq.backend.service;

import com.orbyq.backend.dto.DashboardSummaryDTO;
import com.orbyq.backend.model.Task;
import com.orbyq.backend.model.Project;
import com.orbyq.backend.model.Idea;
import com.orbyq.backend.model.ActivityLog;
import com.orbyq.backend.model.User;
import com.orbyq.backend.repository.TaskRepository;
import com.orbyq.backend.repository.ProjectRepository;
import com.orbyq.backend.repository.IdeaRepository;
import com.orbyq.backend.repository.ActivityLogRepository;
import com.orbyq.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DashboardService {
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private IdeaRepository ideaRepository;
    @Autowired
    private ActivityLogRepository activityLogRepository;
    @Autowired
    private UserRepository userRepository;

    public DashboardSummaryDTO getDashboardSummary(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        User user = userOpt.get();

        // Tasks
        List<Task> tasks = taskRepository.findByUser(user);
        long taskCount = tasks.size();
        long completedTasks = tasks.stream().filter(Task::isCompleted).count();
        double taskProgress = taskCount > 0 ? (completedTasks * 100.0 / taskCount) : 0;

        // Projects
        List<Project> projects = projectRepository.findByUser(user);
        long projectCount = projects.size();

        // Ideas
        List<Idea> ideas = ideaRepository.findByUser(user);
        long ideaCount = ideas.size();
        LocalDateTime yesterday = LocalDateTime.now().minusDays(1);
        long newIdeasSinceYesterday = ideaRepository.countByUserAndCreatedAtAfter(user, yesterday);

        // Recent Activities
        List<ActivityLog> activities = activityLogRepository.findTop5ByUserOrderByCreatedAtDesc(user);
        List<DashboardSummaryDTO.ActivityDTO> activityDTOs = activities.stream()
                .map(a -> new DashboardSummaryDTO.ActivityDTO(a.getAction(), a.getDetails(), a.getCreatedAt()))
                .toList();

        // Upcoming Tasks (next 7 days)
        LocalDate today = LocalDate.now();
        LocalDate endOfWeek = today.plusDays(7);
        List<Task> upcomingTasks = taskRepository.findByUserAndDueDateBetween(user, today, endOfWeek);
        List<DashboardSummaryDTO.TaskDTO> taskDTOs = upcomingTasks.stream()
                .limit(3)
                .map(t -> {
                    String time = t.getDueDate().format(DateTimeFormatter.ofPattern("MMM d, yyyy, h:mm a"));
                    String icon = t.getDueDate().equals(today) ? "Clock" : "Calendar";
                    return new DashboardSummaryDTO.TaskDTO(t.getTitle(), time, icon);
                })
                .toList();

        // Weekly Productivity
        List<DashboardSummaryDTO.ProductivityDTO> productivity = new ArrayList<>();
        String[] days = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};
        for (int i = 0; i < 7; i++) {
            LocalDate day = today.minusDays(today.getDayOfWeek().getValue() - 1).plusDays(i);
            long tasksCompletedOnDay = tasks.stream()
                    .filter(t -> t.isCompleted() && t.getCreatedAt().toLocalDate().equals(day))
                    .count();
            productivity.add(new DashboardSummaryDTO.ProductivityDTO(days[i], (int) tasksCompletedOnDay));
        }

        // Build DTO
        DashboardSummaryDTO summary = new DashboardSummaryDTO();
        summary.setUserName(user.getName() != null ? user.getName() : "User");
        summary.setTaskCount(taskCount);
        summary.setTaskProgress(taskProgress);
        summary.setProjectCount(projectCount);
        summary.setIdeaCount(ideaCount);
        summary.setNewIdeasSinceYesterday(newIdeasSinceYesterday);
        summary.setRecentActivities(activityDTOs);
        summary.setUpcomingTasks(taskDTOs);
        summary.setWeeklyProductivity(productivity);

        return summary;
    }

    public String ping() {
        return "Backend is up";
    }
}