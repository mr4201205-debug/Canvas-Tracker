package com.canvastracker.canvas_tracker.scheduler;

import com.canvastracker.canvas_tracker.service.CanvasSyncService;
import com.canvastracker.canvas_tracker.service.NotificationService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import com.canvastracker.canvas_tracker.repository.UserRepository;
import com.canvastracker.canvas_tracker.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class CanvasScheduler {

    private static final Logger logger = LoggerFactory.getLogger(CanvasScheduler.class);
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
        for (User user : userRepository.findAll()) {
            try {
                canvasSyncService.syncAssignments(user.getId());
            } catch (Exception e) {
                logger.error("Sync failed for user {} ({}): {}",
                        user.getId(), user.getEmail(), e.getMessage());
            }
        }
        try {
            notificationService.checkAndNotify();
        } catch (Exception e) {
            logger.error("Notification check failed: {}", e.getMessage(), e);
        }
    }
}