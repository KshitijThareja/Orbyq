package com.orbyq.backend.repository;

import com.orbyq.backend.model.Task;
import com.orbyq.backend.model.User;
import com.orbyq.backend.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {
    List<Task> findByUser(User user);
    List<Task> findByUserAndCompleted(User user, boolean completed);
    List<Task> findByUserAndDueDateBetween(User user, LocalDate start, LocalDate end);
    List<Task> findByProject(Project project);
}