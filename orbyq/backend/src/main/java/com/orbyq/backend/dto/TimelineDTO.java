package com.orbyq.backend.dto;

import java.util.List;
import java.util.Map;

public class TimelineDTO {
    private List<ProjectDTO> projects;
    private List<MilestoneDTO> upcomingMilestones;
    private Map<String, Double> projectProgress;

    public static class ProjectDTO {
        private String id;
        private String name;
        private String color;
        private List<TaskDTO> tasks;

        public ProjectDTO(String id, String name, String color, List<TaskDTO> tasks) {
            this.id = id;
            this.name = name;
            this.color = color;
            this.tasks = tasks;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
        public List<TaskDTO> getTasks() { return tasks; }
        public void setTasks(List<TaskDTO> tasks) { this.tasks = tasks; }
    }

    public static class TaskDTO {
        private String id;
        private String name;
        private String startDay;
        private int duration;
        private boolean completed;

        public TaskDTO(String id, String name, String startDay, int duration, boolean completed) {
            this.id = id;
            this.name = name;
            this.startDay = startDay;
            this.duration = duration;
            this.completed = completed;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getStartDay() { return startDay; }
        public void setStartDay(String startDay) { this.startDay = startDay; }
        public int getDuration() { return duration; }
        public void setDuration(int duration) { this.duration = duration; }
        public boolean isCompleted() { return completed; }
        public void setCompleted(boolean completed) { this.completed = completed; }
    }

    public static class MilestoneDTO {
        private String name;
        private String project;
        private String date;

        public MilestoneDTO(String name, String project, String date) {
            this.name = name;
            this.project = project;
            this.date = date;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getProject() { return project; }
        public void setProject(String project) { this.project = project; }
        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
    }

    public List<ProjectDTO> getProjects() { return projects; }
    public void setProjects(List<ProjectDTO> projects) { this.projects = projects; }
    public List<MilestoneDTO> getUpcomingMilestones() { return upcomingMilestones; }
    public void setUpcomingMilestones(List<MilestoneDTO> upcomingMilestones) { this.upcomingMilestones = upcomingMilestones; }
    public Map<String, Double> getProjectProgress() { return projectProgress; }
    public void setProjectProgress(Map<String, Double> projectProgress) { this.projectProgress = projectProgress; }
}