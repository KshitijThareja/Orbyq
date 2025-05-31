package com.orbyq.backend.repository;

import com.orbyq.backend.model.Document;
import com.orbyq.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface DocumentRepository extends JpaRepository<Document, UUID> {
    List<Document> findByUser(User user);
}