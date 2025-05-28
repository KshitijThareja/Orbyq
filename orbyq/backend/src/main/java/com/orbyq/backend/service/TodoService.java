package com.orbyq.backend.service;

import com.orbyq.backend.dto.TodoRequest;
import com.orbyq.backend.dto.TodoResponse;
import com.orbyq.backend.model.Todo;
import com.orbyq.backend.model.User;
import com.orbyq.backend.repository.TodoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TodoService {
    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @Transactional
    public TodoResponse createTodo(TodoRequest request, User currentUser) {
        Todo todo = new Todo(
            request.getTitle(),
            request.getDueDate(),
            request.getCategory() != null ? request.getCategory() : Todo.Category.WORK,
            request.getPriority() != null ? request.getPriority() : Todo.Priority.MEDIUM,
            currentUser
        );

        Todo savedTodo = todoRepository.save(todo);
        return convertToResponse(savedTodo);
    }

    @Transactional(readOnly = true)
    public List<TodoResponse> getAllTodos(User currentUser) {
        return todoRepository.findByUserOrderByDueDateAsc(currentUser)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TodoResponse> getTodosByCategory(User currentUser, Todo.Category category) {
        return todoRepository.findByUserAndCategoryOrderByDueDateAsc(currentUser, category)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TodoResponse> getUpcomingTodos(User currentUser) {
        LocalDate now = LocalDate.now();
        LocalDate endDate = now.plusDays(7);
        return todoRepository.findUpcomingTodos(currentUser, now, endDate)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TodoResponse updateTodo(Long todoId, TodoRequest request, User currentUser) {
        Todo todo = todoRepository.findById(todoId)
                .orElseThrow(() -> new IllegalArgumentException("Todo not found"));

        if (!todo.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("Not authorized to update this todo");
        }

        if (request.getTitle() != null) todo.setTitle(request.getTitle());
        if (request.getDueDate() != null) todo.setDueDate(request.getDueDate());
        if (request.getCategory() != null) todo.setCategory(request.getCategory());
        if (request.getPriority() != null) todo.setPriority(request.getPriority());

        Todo updatedTodo = todoRepository.save(todo);
        return convertToResponse(updatedTodo);
    }

    @Transactional
    public void deleteTodo(Long todoId, User currentUser) {
        Todo todo = todoRepository.findById(todoId)
                .orElseThrow(() -> new IllegalArgumentException("Todo not found"));

        if (!todo.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("Not authorized to delete this todo");
        }

        todoRepository.delete(todo);
    }

    @Transactional
    public TodoResponse toggleTodoCompletion(Long todoId, User currentUser) {
        Todo todo = todoRepository.findById(todoId)
                .orElseThrow(() -> new IllegalArgumentException("Todo not found"));

        if (!todo.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("Not authorized to update this todo");
        }

        todo.setCompleted(!todo.isCompleted());
        Todo updatedTodo = todoRepository.save(todo);
        return convertToResponse(updatedTodo);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getTodoSummary(User currentUser) {
        long completedCount = todoRepository.countByUserAndCompleted(currentUser, true);
        long remainingCount = todoRepository.countByUserAndCompleted(currentUser, false);

        Map<Todo.Category, Long> categoryCounts = Map.of(
            Todo.Category.WORK, todoRepository.countByUserAndCategory(currentUser, Todo.Category.WORK),
            Todo.Category.PERSONAL, todoRepository.countByUserAndCategory(currentUser, Todo.Category.PERSONAL),
            Todo.Category.LEARNING, todoRepository.countByUserAndCategory(currentUser, Todo.Category.LEARNING)
        );

        Map<Todo.Priority, Long> priorityCounts = Map.of(
            Todo.Priority.HIGH, todoRepository.countByUserAndPriority(currentUser, Todo.Priority.HIGH),
            Todo.Priority.MEDIUM, todoRepository.countByUserAndPriority(currentUser, Todo.Priority.MEDIUM),
            Todo.Priority.LOW, todoRepository.countByUserAndPriority(currentUser, Todo.Priority.LOW)
        );

        return Map.of(
            "completed", completedCount,
            "remaining", remainingCount,
            "categories", categoryCounts,
            "priorities", priorityCounts,
            "upcoming", getUpcomingTodos(currentUser)
        );
    }

    private TodoResponse convertToResponse(Todo todo) {
        TodoResponse response = new TodoResponse();
        response.setId(todo.getId());
        response.setTitle(todo.getTitle());
        response.setCompleted(todo.isCompleted());
        response.setDueDate(todo.getDueDate());
        response.setCategory(todo.getCategory());
        response.setPriority(todo.getPriority());
        return response;
    }
}