package com.orbyq.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.orbyq.backend.model.ActivityLog;
import com.orbyq.backend.model.User;
import java.util.List;
import java.util.UUID;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, UUID> {
    List<ActivityLog> findTop5ByUserOrderByCreatedAtDesc(User user);
}