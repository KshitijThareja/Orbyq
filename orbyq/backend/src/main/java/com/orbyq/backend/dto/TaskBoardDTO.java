package com.orbyq.backend.dto;

import java.time.LocalDate;
import java.util.Map;

public class TaskBoardDTO {
    private Map<String, ColumnDTO> columns;
    private Map<String, TaskDTO> tasks;
    private String[] columnOrder;

    public static class ColumnDTO {
        private String id;
        private String title;
        private String[] taskIds;

        public ColumnDTO(String id, String title, String[] taskIds) {
            this.id = id;
            this.title = title;
            this.taskIds = taskIds;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String[] getTaskIds() { return taskIds; }
        public void setTaskIds(String[] taskIds) { this.taskIds = taskIds; }
    }

    public static class TaskDTO {
        private String id;
        private String title;
        private String description;
        private String priority;
        private LocalDate dueDate;
        private int comments;
        private int attachments;

        public TaskDTO(String id, String title, String description, String priority, LocalDate dueDate, int comments, int attachments) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.priority = priority;
            this.dueDate = dueDate;
            this.comments = comments;
            this.attachments = attachments;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getPriority() { return priority; }
        public void setPriority(String priority) { this.priority = priority; }
        public LocalDate getDueDate() { return dueDate; }
        public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
        public int getComments() { return comments; }
        public void setComments(int comments) { this.comments = comments; }
        public int getAttachments() { return attachments; }
        public void setAttachments(int attachments) { this.attachments = attachments; }
    }

    public Map<String, ColumnDTO> getColumns() { return columns; }
    public void setColumns(Map<String, ColumnDTO> columns) { this.columns = columns; }
    public Map<String, TaskDTO> getTasks() { return tasks; }
    public void setTasks(Map<String, TaskDTO> tasks) { this.tasks = tasks; }
    public String[] getColumnOrder() { return columnOrder; }
    public void setColumnOrder(String[] columnOrder) { this.columnOrder = columnOrder; }
}