package com.orbyq.backend.repository;

import com.orbyq.backend.model.Todo;
import com.orbyq.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByUserOrderByDueDateAsc(User user);
    
    List<Todo> findByUserAndCategoryOrderByDueDateAsc(User user, Todo.Category category);
    
    List<Todo> findByUserAndCompletedOrderByDueDateAsc(User user, boolean completed);
    
    List<Todo> findByUserAndPriorityOrderByDueDateAsc(User user, Todo.Priority priority);
    
    @Query("SELECT t FROM Todo t WHERE t.user = :user AND t.dueDate >= :startDate AND t.dueDate <= :endDate AND t.completed = false ORDER BY t.dueDate ASC")
    List<Todo> findUpcomingTodos(
        @Param("user") User user,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT COUNT(t) FROM Todo t WHERE t.user = :user AND t.completed = :completed")
    long countByUserAndCompleted(@Param("user") User user, @Param("completed") boolean completed);
    
    @Query("SELECT COUNT(t) FROM Todo t WHERE t.user = :user AND t.category = :category")
    long countByUserAndCategory(@Param("user") User user, @Param("category") Todo.Category category);
    
    @Query("SELECT COUNT(t) FROM Todo t WHERE t.user = :user AND t.priority = :priority")
    long countByUserAndPriority(@Param("user") User user, @Param("priority") Todo.Priority priority);
}