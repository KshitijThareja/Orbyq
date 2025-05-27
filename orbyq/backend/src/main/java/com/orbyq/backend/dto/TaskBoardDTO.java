package com.orbyq.backend.dto;

import java.util.Map;

public class TaskBoardDTO {
    private Map<String, ColumnDTO> columns;
    private Map<String, TaskDTO> tasks;
    private String[] columnOrder;

    public static class ColumnDTO {
        private String id;
        private String title;
        private String[] taskIds;

        public ColumnDTO() {}

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
        private String dueDate; // Changed to String to match frontend
        private String status;  // Added status field
        private int comments;
        private int attachments;

        public TaskDTO() {}

        public TaskDTO(String id, String title, String description, String priority, String dueDate, String status, int comments, int attachments) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.priority = priority;
            this.dueDate = dueDate;
            this.status = status;
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
        public String getDueDate() { return dueDate; }
        public void setDueDate(String dueDate) { this.dueDate = dueDate; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public int getComments() { return comments; }
        public void setComments(int comments) { this.comments = comments; }
        public int getAttachments() { return attachments; }
        public void setAttachments(int attachments) { this.attachments = attachments; }
    }

    public TaskBoardDTO() {}

    public Map<String, ColumnDTO> getColumns() { return columns; }
    public void setColumns(Map<String, ColumnDTO> columns) { this.columns = columns; }
    public Map<String, TaskDTO> getTasks() { return tasks; }
    public void setTasks(Map<String, TaskDTO> tasks) { this.tasks = tasks; }
    public String[] getColumnOrder() { return columnOrder; }
    public void setColumnOrder(String[] columnOrder) { this.columnOrder = columnOrder; }
}