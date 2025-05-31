package com.orbyq.backend.repository;

import com.orbyq.backend.model.Canvas;
import com.orbyq.backend.model.CanvasItem;
import com.orbyq.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface CanvasItemRepository extends JpaRepository<CanvasItem, UUID> {
    List<CanvasItem> findByUser(User user);
    List<CanvasItem> findByCanvas(Canvas canvas);
}