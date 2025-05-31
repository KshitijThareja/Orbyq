package com.orbyq.backend.repository;

import com.orbyq.backend.model.Todo;
import com.orbyq.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

public interface TodoRepository extends JpaRepository<Todo, UUID>, JpaSpecificationExecutor<Todo> {

    Page<Todo> findByUser(User user, Pageable pageable);

    Page<Todo> findByUserAndCompleted(User user, boolean completed, Pageable pageable);

    Page<Todo> findByUserAndPriority(User user, Todo.Priority priority, Pageable pageable);

    Page<Todo> findByUserAndCategory(User user, Todo.Category category, Pageable pageable);

    Page<Todo> findByUserAndCompletedAndPriority(User user, boolean completed, Todo.Priority priority, Pageable pageable);

    Page<Todo> findByUserAndCompletedAndCategory(User user, boolean completed, Todo.Category category, Pageable pageable);

    Page<Todo> findByUserAndPriorityAndCategory(User user, Todo.Priority priority, Todo.Category category, Pageable pageable);

    Page<Todo> findByUserAndCompletedAndPriorityAndCategory(
            User user, boolean completed, Todo.Priority priority, Todo.Category category, Pageable pageable);
}