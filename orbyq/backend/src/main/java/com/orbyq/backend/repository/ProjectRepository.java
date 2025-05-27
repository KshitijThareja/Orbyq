package com.orbyq.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.orbyq.backend.model.Project;
import com.orbyq.backend.model.User;
import java.util.List;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {
    List<Project> findByUser(User user);
}