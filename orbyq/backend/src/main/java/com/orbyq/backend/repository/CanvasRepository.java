package com.orbyq.backend.repository;

import com.orbyq.backend.model.Canvas;
import com.orbyq.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CanvasRepository extends JpaRepository<Canvas, UUID> {
    List<Canvas> findByUser(User user);
}