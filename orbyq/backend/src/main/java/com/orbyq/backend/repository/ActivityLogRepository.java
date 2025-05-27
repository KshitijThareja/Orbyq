package com.orbyq.backend.repository;

import com.orbyq.backend.model.ActivityLog;
import com.orbyq.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, UUID> {
    List<ActivityLog> findTop5ByUserOrderByCreatedAtDesc(User user);
    List<ActivityLog> findTop5ByUserAndActionStartingWithOrderByCreatedAtDesc(User user, String actionPrefix);
}