package com.canvastracker.canvas_tracker.controller;


import com.canvastracker.canvas_tracker.model.NotificationPreference;
import com.canvastracker.canvas_tracker.model.User;
import com.canvastracker.canvas_tracker.repository.NotificationPreferenceRepository;
import com.canvastracker.canvas_tracker.service.EncryptionService;
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
    private final NotificationPreferenceRepository notificationPreferenceRepository;
    private final EncryptionService encryptionService;


    public UserController(UserService userService,
                          com.canvastracker.canvas_tracker.repository.UserRepository userRepository,
                          AssignmentService assignmentService, PasswordEncoder passwordEncoder,
                          NotificationPreferenceRepository notificationPreferenceRepository,
                          EncryptionService encryptionService) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.assignmentService = assignmentService;
        this.passwordEncoder = passwordEncoder;
        this.notificationPreferenceRepository = notificationPreferenceRepository;
        this.encryptionService = encryptionService;
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
            if (updatedUser.getCanvasToken() != null && !updatedUser.getCanvasToken().isEmpty()) {
                user.setCanvasToken(encryptionService.encrypt(updatedUser.getCanvasToken()));
            }
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

    @GetMapping("/me/preferences")
    public ResponseEntity<?> getPreferences(
            org.springframework.security.core.Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email).map(user -> {
            NotificationPreference pref = notificationPreferenceRepository
                    .findByUserId(user.getId())
                    .orElseGet(() -> {
                        NotificationPreference newPref = new NotificationPreference();
                        newPref.setUser(user);
                        return notificationPreferenceRepository.save(newPref);
                    });
            return ResponseEntity.ok(pref);
        }).orElse(ResponseEntity.badRequest().build());
    }

    @PutMapping("/me/preferences")
    public ResponseEntity<String> updatePreferences(
            @RequestBody NotificationPreference updatedPref,
            org.springframework.security.core.Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email).map(user -> {
            NotificationPreference pref = notificationPreferenceRepository
                    .findByUserId(user.getId())
                    .orElseGet(() -> {
                        NotificationPreference newPref = new NotificationPreference();
                        newPref.setUser(user);
                        return newPref;
                    });
            pref.setNotify72Hours(updatedPref.isNotify72Hours());
            pref.setNotify24Hours(updatedPref.isNotify24Hours());
            pref.setNotify4Hours(updatedPref.isNotify4Hours());
            notificationPreferenceRepository.save(pref);
            return ResponseEntity.ok("Preferences updated successfully");
        }).orElse(ResponseEntity.badRequest().body("User not found"));
    }



}
