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
    public TimelineDTO getTimeline(Authentication authentication) {
        String username = authentication.getName();
        return timelineService.getTimelineData(username);
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
            taskRequest.projectId,
            taskRequest.startDay,
            taskRequest.duration
        );
    }

    public static class TaskRequest {
        private String title;
        private String projectId;
        private String startDay;
        private int duration;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getProjectId() { return projectId; }
        public void setProjectId(String projectId) { this.projectId = projectId; }
        public String getStartDay() { return startDay; }
        public void setStartDay(String startDay) { this.startDay = startDay; }
        public int getDuration() { return duration; }
        public void setDuration(int duration) { this.duration = duration; }
    }
}