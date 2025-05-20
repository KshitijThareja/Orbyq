package com.orbyq.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.orbyq.backend.model.Idea;
import com.orbyq.backend.model.User;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface IdeaRepository extends JpaRepository<Idea, UUID> {
    List<Idea> findByUser(User user);
    @Query("SELECT COUNT(i) FROM Idea i WHERE i.user = :user AND i.createdAt >= :since")
    long countByUserAndCreatedAtAfter(User user, LocalDateTime since);
}