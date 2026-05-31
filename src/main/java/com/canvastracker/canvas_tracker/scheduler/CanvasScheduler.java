package com.canvastracker.canvas_tracker.scheduler;

import com.canvastracker.canvas_tracker.service.CanvasSyncService;
import com.canvastracker.canvas_tracker.service.NotificationService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import com.canvastracker.canvas_tracker.repository.UserRepository;


@Component
public class CanvasScheduler {

    private final CanvasSyncService canvasSyncService;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public CanvasScheduler(CanvasSyncService canvasSyncService,
                           NotificationService notificationService, UserRepository userRepository) {
        this.canvasSyncService = canvasSyncService;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    @Scheduled(fixedRate = 3600000)
    public void syncAndNotify() {
        userRepository.findAll().forEach(user -> {
            canvasSyncService.syncAssignments(user.getId());
        });
        notificationService.checkAndNotify();
    }
}