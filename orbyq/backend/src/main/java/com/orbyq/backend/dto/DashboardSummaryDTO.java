package com.orbyq.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class DashboardSummaryDTO {
    private String userName;
    private long taskCount;
    private double taskProgress;
    private long projectCount;
    private double projectProgress;
    private long ideaCount;
    private long newIdeasSinceYesterday;
    private List<ActivityDTO> recentProjectActivities;
    private List<ActivityDTO> recentActivities;
    private List<TaskDTO> upcomingTasks;
    private List<ProductivityDTO> weeklyProductivity;

    public static class ActivityDTO {
        private String action;
        private String details;
        private LocalDateTime createdAt;

        public ActivityDTO(String action, String details, LocalDateTime createdAt) {
            this.action = action;
            this.details = details;
            this.createdAt = createdAt;
        }

        public String getAction() { return action; }
        public void setAction(String action) { this.action = action; }
        public String getDetails() { return details; }
        public void setDetails(String details) { this.details = details; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }

    public static class TaskDTO {
        private String title;
        private String time;
        private String icon;

        public TaskDTO(String title, String time, String icon) {
            this.title = title;
            this.time = time;
            this.icon = icon;
        }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getTime() { return time; }
        public void setTime(String time) { this.time = time; }
        public String getIcon() { return icon; }
        public void setIcon(String icon) { this.icon = icon; }
    }

    public static class ProductivityDTO {
        private String day;
        private int taskCount;

        public ProductivityDTO(String day, int taskCount) {
            this.day = day;
            this.taskCount = taskCount;
        }

        public String getDay() { return day; }
        public void setDay(String day) { this.day = day; }
        public int getTaskCount() { return taskCount; }
        public void setTaskCount(int taskCount) { this.taskCount = taskCount; }
    }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public long getTaskCount() { return taskCount; }
    public void setTaskCount(long taskCount) { this.taskCount = taskCount; }
    public double getTaskProgress() { return taskProgress; }
    public void setTaskProgress(double taskProgress) { this.taskProgress = taskProgress; }
    public long getProjectCount() { return projectCount; }
    public void setProjectCount(long projectCount) { this.projectCount = projectCount; }
    public double getProjectProgress() { return projectProgress; }
    public void setProjectProgress(double projectProgress) { this.projectProgress = projectProgress; }
    public long getIdeaCount() { return ideaCount; }
    public void setIdeaCount(long ideaCount) { this.ideaCount = ideaCount; }
    public long getNewIdeasSinceYesterday() { return newIdeasSinceYesterday; }
    public void setNewIdeasSinceYesterday(long newIdeasSinceYesterday) { this.newIdeasSinceYesterday = newIdeasSinceYesterday; }
    public List<ActivityDTO> getRecentProjectActivities() { return recentProjectActivities; }
    public void setRecentProjectActivities(List<ActivityDTO> recentProjectActivities) { this.recentProjectActivities = recentProjectActivities; }
    public List<ActivityDTO> getRecentActivities() { return recentActivities; }
    public void setRecentActivities(List<ActivityDTO> recentActivities) { this.recentActivities = recentActivities; }
    public List<TaskDTO> getUpcomingTasks() { return upcomingTasks; }
    public void setUpcomingTasks(List<TaskDTO> upcomingTasks) { this.upcomingTasks = upcomingTasks; }
    public List<ProductivityDTO> getWeeklyProductivity() { return weeklyProductivity; }
    public void setWeeklyProductivity(List<ProductivityDTO> weeklyProductivity) { this.weeklyProductivity = weeklyProductivity; }
}