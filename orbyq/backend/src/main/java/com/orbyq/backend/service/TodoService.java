package com.orbyq.backend.service;

import com.orbyq.backend.model.Todo;
import com.orbyq.backend.model.User;
import com.orbyq.backend.repository.TodoRepository;
import com.orbyq.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TodoService {

    @Autowired
    private TodoRepository todoRepository;

    @Autowired
    private UserRepository userRepository;

    public PaginatedTodosDTO getTodos(
            String username,
            int page,
            int size,
            String sortBy,
            String sortDirection,
            Boolean completed,
            String priority,
            String category
    ) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        String normalizedPriority = priority != null ? priority.toLowerCase() : null;
        String normalizedCategory = category != null ? category.toLowerCase() : null;
        String normalizedSortBy = sortBy != null ? sortBy.toLowerCase() : "createdat";
        String normalizedSortDirection = sortDirection != null && sortDirection.equalsIgnoreCase("asc") ? "asc" : "desc";

        String sortField;
        switch (normalizedSortBy) {
            case "title":
                sortField = "title";
                break;
            case "priority":
                sortField = "priority";
                break;
            case "duedate":
                sortField = "dueDate";
                break;
            case "createdat":
            default:
                sortField = "createdAt";
        }

        Sort sort = Sort.by(
                normalizedSortDirection.equals("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,
                sortField
        );
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Todo> spec = Specification.where((root, query, cb) -> cb.equal(root.get("user"), user));
        if (completed != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("completed"), completed));
        }
        if (normalizedPriority != null && !normalizedPriority.equals("all")) {
            try {
                Todo.Priority priorityEnum = Todo.Priority.valueOf(normalizedPriority.toUpperCase());
                spec = spec.and((root, query, cb) -> cb.equal(root.get("priority"), priorityEnum));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid priority: " + normalizedPriority);
            }
        }
        if (normalizedCategory != null && !normalizedCategory.equals("all")) {
            try {
                Todo.Category categoryEnum = Todo.Category.valueOf(normalizedCategory.toUpperCase());
                spec = spec.and((root, query, cb) -> cb.equal(root.get("category"), categoryEnum));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid category: " + normalizedCategory);
            }
        }

        Page<Todo> todoPage = todoRepository.findAll(spec, pageable);

        List<TodoDTO> todos = todoPage.getContent().stream().map(todo -> new TodoDTO(
                todo.getId().toString(),
                todo.getTitle(),
                todo.isCompleted(),
                todo.getPriority().toString().toLowerCase(),
                todo.getDueDate() != null ? todo.getDueDate().toString() : "",
                todo.getCategory().toString().toLowerCase()
        )).collect(Collectors.toList());

        return new PaginatedTodosDTO(todos, todoPage.getTotalPages(), todoPage.getTotalElements());
    }

    public void addTodo(String username, String title, String priority, String dueDate, String category) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        Todo todo = new Todo();
        todo.setUser(user);
        todo.setTitle(title);
        todo.setCompleted(false);
        try {
            todo.setPriority(Todo.Priority.valueOf(priority.toUpperCase()));
            todo.setCategory(Todo.Category.valueOf(category.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid priority or category: " + e.getMessage());
        }
        todo.setDueDate(dueDate != null && !dueDate.isEmpty() ? LocalDate.parse(dueDate) : null);
        todo.setVersion(0L);

        todoRepository.save(todo);
    }

    public void updateTodoCompletion(String username, String todoId, boolean completed) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        Todo todo = todoRepository.findById(UUID.fromString(todoId))
                .orElseThrow(() -> new IllegalArgumentException("Todo not found: " + todoId));

        if (!todo.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to update this todo");
        }

        todo.setCompleted(completed);
        todoRepository.save(todo);
    }

    public void updateTodo(String username, String todoId, String title, String priority, String dueDate, String category) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        Todo todo = todoRepository.findById(UUID.fromString(todoId))
                .orElseThrow(() -> new IllegalArgumentException("Todo not found: " + todoId));

        if (!todo.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to update this todo");
        }

        todo.setTitle(title);
        try {
            todo.setPriority(Todo.Priority.valueOf(priority.toUpperCase()));
            todo.setCategory(Todo.Category.valueOf(category.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid priority or category: " + e.getMessage());
        }
        todo.setDueDate(dueDate != null && !dueDate.isEmpty() ? LocalDate.parse(dueDate) : null);
        todoRepository.save(todo);
    }

    public void deleteTodo(String username, String todoId) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        Todo todo = todoRepository.findById(UUID.fromString(todoId))
                .orElseThrow(() -> new IllegalArgumentException("Todo not found: " + todoId));

        if (!todo.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized to delete this todo");
        }

        todoRepository.delete(todo);
    }

    public static class TodoDTO {
        private String id;
        private String title;
        private boolean completed;
        private String priority;
        private String dueDate;
        private String category;

        public TodoDTO(String id, String title, boolean completed, String priority, String dueDate, String category) {
            this.id = id;
            this.title = title;
            this.completed = completed;
            this.priority = priority;
            this.dueDate = dueDate;
            this.category = category;
        }

        public String getId() { return id; }
        public String getTitle() { return title; }
        public boolean isCompleted() { return completed; }
        public String getPriority() { return priority; }
        public String getDueDate() { return dueDate; }
        public String getCategory() { return category; }
    }

    public static class PaginatedTodosDTO {
        private List<TodoDTO> todos;
        private int totalPages;
        private long totalElements;

        public PaginatedTodosDTO(List<TodoDTO> todos, int totalPages, long totalElements) {
            this.todos = todos;
            this.totalPages = totalPages;
            this.totalElements = totalElements;
        }

        public List<TodoDTO> getTodos() { return todos; }
        public int getTotalPages() { return totalPages; }
        public long getTotalElements() { return totalElements; }
    }
}