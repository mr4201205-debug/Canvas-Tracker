package com.canvastracker.canvas_tracker.controller;

import com.canvastracker.canvas_tracker.service.NotificationService;
import com.canvastracker.canvas_tracker.service.CanvasApiService;
import com.canvastracker.canvas_tracker.service.CanvasSyncService;
import org.springframework.web.bind.annotation.*;
import com.canvastracker.canvas_tracker.repository.UserRepository;

@RestController
@RequestMapping("/canvas")
public class CanvasController {

    private final CanvasApiService canvasApiService;
    private final CanvasSyncService canvasSyncService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;



    public CanvasController(CanvasApiService canvasApiService, CanvasSyncService canvasSyncService, NotificationService notificationService, UserRepository userRepository) {
        this.canvasApiService = canvasApiService;
        this.canvasSyncService = canvasSyncService;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    @GetMapping("/courses")
    public String getCourses(
            org.springframework.security.core.Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .map(user -> canvasApiService.getCourses(user.getCanvasBaseUrl(), user.getCanvasToken()))
                .orElse("User not found");
    }

    @GetMapping("/courses/{courseId}/assignments")
    public String getAssignments(
            @PathVariable String courseId,
            org.springframework.security.core.Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .map(user -> canvasApiService.getAssignments(user.getCanvasBaseUrl(), user.getCanvasToken(), courseId))
                .orElse("User not found");
    }


    @GetMapping("/sync")
    public String syncAssignments(
            org.springframework.security.core.Authentication authentication) {
        String email = authentication.getName();
        userRepository.findByEmail(email).ifPresent(user ->
                canvasSyncService.syncAssignments(user.getId()));
        return "Sync completed successfully";
    }

    @GetMapping("/notify")
    public String checkNotifications() {
        notificationService.checkAndNotify();
        return "Notification check completed";
    }
}