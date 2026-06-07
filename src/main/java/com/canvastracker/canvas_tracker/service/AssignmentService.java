package com.canvastracker.canvas_tracker.service;

import com.canvastracker.canvas_tracker.model.Assignment;
import com.canvastracker.canvas_tracker.repository.AssignmentRepository;
import com.canvastracker.canvas_tracker.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final UserRepository userRepository;

    public AssignmentService(AssignmentRepository assignmentRepository, UserRepository userRepository) {
        this.assignmentRepository = assignmentRepository;
        this.userRepository = userRepository;
    }

    public Assignment saveAssignment(Long userId, Assignment assignment) {
        return userRepository.findById(userId).map(user -> {
            assignment.setUser(user);
            return assignmentRepository.save(assignment);
        }).orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }
    public Assignment markAsSubmitted(Long assignmentId) {
        return assignmentRepository.findById(assignmentId).map(assignment -> {
            assignment.setSubmitted(true);
            return assignmentRepository.save(assignment);
        }).orElseThrow(() -> new RuntimeException("Assignment not found with id: " + assignmentId));
    }



    public List<Assignment> getAssignmentsByUser(Long userId) {
        return assignmentRepository.findByUserId(userId);
    }
}