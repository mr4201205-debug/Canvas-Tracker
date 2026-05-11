package com.canvastracker.canvas_tracker.controller;

import com.canvastracker.canvas_tracker.service.CanvasApiService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/canvas")
public class CanvasController {

    private final CanvasApiService canvasApiService;

    public CanvasController(CanvasApiService canvasApiService) {
        this.canvasApiService = canvasApiService;
    }

    @GetMapping("/courses")
    public String getCourses() {
        return canvasApiService.getCourses();
    }

    @GetMapping("/courses/{courseId}/assignments")
    public String getAssignments(@PathVariable String courseId) {
        return canvasApiService.getAssignments(courseId);
    }
}