package com.canvastracker.canvas_tracker.controller;

import com.canvastracker.canvas_tracker.service.CanvasApiService;
import com.canvastracker.canvas_tracker.service.CanvasSyncService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/canvas")
public class CanvasController {

    private final CanvasApiService canvasApiService;
    private final CanvasSyncService canvasSyncService;


    public CanvasController(CanvasApiService canvasApiService, CanvasSyncService canvasSyncService) {
        this.canvasApiService = canvasApiService;
        this.canvasSyncService = canvasSyncService;
    }

    @GetMapping("/courses")
    public String getCourses() {
        return canvasApiService.getCourses();
    }

    @GetMapping("/courses/{courseId}/assignments")
    public String getAssignments(@PathVariable String courseId) {
        return canvasApiService.getAssignments(courseId);
    }


    @GetMapping("/sync")
    public String syncAssignments() {
        canvasSyncService.syncAssignments();
        return "Sync completed successfully";
    }
}