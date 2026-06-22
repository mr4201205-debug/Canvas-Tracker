package com.canvastracker.canvas_tracker.controller;


import com.canvastracker.canvas_tracker.model.User;
import com.canvastracker.canvas_tracker.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.canvastracker.canvas_tracker.service.AssignmentService;
import com.canvastracker.canvas_tracker.model.Assignment;
import java.util.List;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/users")

public class UserController {
    private final UserService userService;
    private final com.canvastracker.canvas_tracker.repository.UserRepository userRepository;
    private final AssignmentService assignmentService;
    private final PasswordEncoder passwordEncoder;


    public UserController(UserService userService,
                          com.canvastracker.canvas_tracker.repository.UserRepository userRepository, AssignmentService assignmentService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.assignmentService = assignmentService;
        this.passwordEncoder = passwordEncoder;
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

    @PutMapping("/me")
    public ResponseEntity<String> updateProfile(
            @RequestBody User updatedUser,
            org.springframework.security.core.Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email).map(user -> {
            user.setName(updatedUser.getName());
            user.setCanvasBaseUrl(updatedUser.getCanvasBaseUrl());
            user.setEmail(updatedUser.getEmail());
            userRepository.save(user);
            return ResponseEntity.ok("Profile updated successfully");
        }).orElse(ResponseEntity.badRequest().body("User not found"));
    }

    @PutMapping("/me/password")
    public ResponseEntity<String> changePassword(
            @RequestBody java.util.Map<String, String> request,
            org.springframework.security.core.Authentication authentication) {
        String email = authentication.getName();
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");

        return userRepository.findByEmail(email).map(user -> {
            if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                return ResponseEntity.badRequest().body("Current password is incorrect");
            }
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return ResponseEntity.ok("Password changed successfully");
        }).orElse(ResponseEntity.badRequest().body("User not found"));
    }



}
