package com.canvastracker.canvas_tracker.scheduler;

import com.canvastracker.canvas_tracker.service.CanvasSyncService;
import com.canvastracker.canvas_tracker.service.NotificationService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class CanvasScheduler {

    private final CanvasSyncService canvasSyncService;
    private final NotificationService notificationService;

    public CanvasScheduler(CanvasSyncService canvasSyncService,
                           NotificationService notificationService) {
        this.canvasSyncService = canvasSyncService;
        this.notificationService = notificationService;
    }

    @Scheduled(fixedRate = 3600000)
    public void syncAndNotify() {
        canvasSyncService.syncAssignments();
        notificationService.checkAndNotify();
    }
}