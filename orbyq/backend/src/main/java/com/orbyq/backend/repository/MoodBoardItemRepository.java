package com.orbyq.backend.repository;

import com.orbyq.backend.model.MoodBoardItem;
import com.orbyq.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface MoodBoardItemRepository extends JpaRepository<MoodBoardItem, UUID> {
    List<MoodBoardItem> findByUser(User user);
}