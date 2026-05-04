package com.canvastracker.canvas_tracker.repository;

import com.canvastracker.canvas_tracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
