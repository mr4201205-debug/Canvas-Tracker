package com.canvastracker.canvas_tracker.repository;

import com.canvastracker.canvas_tracker.model.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    List<Assignment> findByUserId(Long userId);
}