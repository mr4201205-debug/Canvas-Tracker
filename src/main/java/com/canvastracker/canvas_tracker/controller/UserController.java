package com.canvastracker.canvas_tracker.controller;


import com.canvastracker.canvas_tracker.model.User;
import com.canvastracker.canvas_tracker.service.UserService;
import org.springframework.web.bind.annotation.*;
import com.canvastracker.canvas_tracker.service.AssignmentService;
import com.canvastracker.canvas_tracker.model.Assignment;
import java.util.List;


@RestController
@RequestMapping("/users")

public class UserController {
    private final UserService userService;
    private final com.canvastracker.canvas_tracker.repository.UserRepository userRepository;
    private final AssignmentService assignmentService;


    public UserController(UserService userService,
                          com.canvastracker.canvas_tracker.repository.UserRepository userRepository, AssignmentService assignmentService) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.assignmentService = assignmentService;
    }




    @GetMapping("/me")
    public User getCurrentUser(org.springframework.security.core.Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/me/assignments")
    public List<Assignment> getMyAssignments(
            org.springframework.security.core.Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .map(user -> assignmentService.getAssignmentsByUser(user.getId()))
                .orElse(List.of());
    }

    @PutMapping("/me/assignments/{assignmentId}/submit")
    public Assignment markAsSubmitted(@PathVariable Long assignmentId) {
        return assignmentService.markAsSubmitted(assignmentId);
    }


}
