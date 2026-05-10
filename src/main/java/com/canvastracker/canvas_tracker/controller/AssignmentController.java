package com.canvastracker.canvas_tracker.controller;

import com.canvastracker.canvas_tracker.model.Assignment;
import com.canvastracker.canvas_tracker.service.AssignmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users/{userId}/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @PostMapping
    public Assignment createAssignment(@PathVariable Long userId, @RequestBody Assignment assignment) {
        return assignmentService.saveAssignment(userId, assignment);
    }

    @GetMapping
    public List<Assignment> getAssignments(@PathVariable Long userId) {
        return assignmentService.getAssignmentsByUser(userId);
    }
}