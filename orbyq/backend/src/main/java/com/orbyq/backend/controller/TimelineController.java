package com.orbyq.backend.controller;

import com.orbyq.backend.dto.TimelineDTO;
import com.orbyq.backend.service.TimelineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/timeline")
public class TimelineController {

    @Autowired
    private TimelineService timelineService;

    @GetMapping
    public TimelineDTO getTimeline(
        Authentication authentication,
        @RequestParam(value = "status", required = false) String status,
        @RequestParam(value = "priority", required = false) String priority
    ) {
        String username = authentication.getName();
        return timelineService.getTimelineData(username, status, priority);
    }

    @PostMapping("/task")
    public void addTask(
        @RequestBody TaskRequest taskRequest,
        Authentication authentication
    ) {
        String username = authentication.getName();
        timelineService.addTask(
            username,
            taskRequest.title,
            taskRequest.description,
            taskRequest.priority,
            taskRequest.projectId,
            taskRequest.startDay,
            taskRequest.duration
        );
    }

    @PostMapping("/project/color")
    public void updateProjectColor(
        @RequestBody ColorRequest colorRequest,
        Authentication authentication
    ) {
        String username = authentication.getName();
        timelineService.updateProjectColor(
            username,
            colorRequest.projectId,
            colorRequest.color
        );
    }

    @PostMapping("/project")
    public void createProject(
        @RequestBody ProjectRequest projectRequest,
        Authentication authentication
    ) {
        String username = authentication.getName();
        timelineService.createProject(
            username,
            projectRequest.name,
            projectRequest.color
        );
    }

    public static class TaskRequest {
        private String title;
        private String description;
        private String priority;
        private String projectId;
        private String startDay;
        private int duration;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getPriority() { return priority; }
        public void setPriority(String priority) { this.priority = priority; }
        public String getProjectId() { return projectId; }
        public void setProjectId(String projectId) { this.projectId = projectId; }
        public String getStartDay() { return startDay; }
        public void setStartDay(String startDay) { this.startDay = startDay; }
        public int getDuration() { return duration; }
        public void setDuration(int duration) { this.duration = duration; }
    }

    public static class ColorRequest {
        private String projectId;
        private String color;

        public String getProjectId() { return projectId; }
        public void setProjectId(String projectId) { this.projectId = projectId; }
        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
    }

    public static class ProjectRequest {
        private String name;
        private String color;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
    }
}