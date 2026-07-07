package com.canvastracker.canvas_tracker.service;

import com.canvastracker.canvas_tracker.model.Assignment;
import com.canvastracker.canvas_tracker.repository.AssignmentRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import com.canvastracker.canvas_tracker.repository.NotificationPreferenceRepository;
import com.canvastracker.canvas_tracker.model.NotificationPreference;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class NotificationService {

    private final AssignmentRepository assignmentRepository;
    private final CanvasApiService canvasApiService;
    private final JavaMailSender mailSender;
    private final NotificationPreferenceRepository notificationPreferenceRepository;

    private static final org.slf4j.Logger logger =
            org.slf4j.LoggerFactory.getLogger(NotificationService.class);

    public NotificationService(AssignmentRepository assignmentRepository,
                               CanvasApiService canvasApiService,
                               JavaMailSender mailSender,
                               NotificationPreferenceRepository notificationPreferenceRepository) {
        this.assignmentRepository = assignmentRepository;
        this.canvasApiService = canvasApiService;
        this.mailSender = mailSender;
        this.notificationPreferenceRepository = notificationPreferenceRepository;
    }

    public void checkAndNotify() {
        List<Assignment> assignments = assignmentRepository.findAll();

        for (Assignment assignment : assignments) {
            if (assignment.isSubmitted()) {
                continue;
            }

            LocalDateTime now = LocalDateTime.now();
            LocalDateTime dueDate = assignment.getDueDate();

            if (dueDate == null) {
                continue;
            }

            long hoursUntilDue = ChronoUnit.HOURS.between(now, dueDate);
            if (hoursUntilDue < 0) {
                continue;
            }

            LocalDateTime lastNotified = assignment.getLastNotifiedAt();
            if (lastNotified != null) {
                long hoursSinceLastEmail = ChronoUnit.HOURS.between(lastNotified, now);

                // 1. If we are in the 24h or 72h window, block it if it's been less than 23 hours
                if (hoursUntilDue > 4 && hoursSinceLastEmail < 23) {
                    continue;
                }

                // 2. If we are in the urgent 4h window, block it only if we already sent one in the last 3 hours
                if (hoursUntilDue <= 4 && hoursSinceLastEmail < 3) {
                    continue;
                }
            }

            Long userId = assignment.getUser().getId();
            NotificationPreference pref = notificationPreferenceRepository
                    .findByUserId(userId)
                    .orElse(null);

            boolean notify72 = pref == null || pref.isNotify72Hours();
            boolean notify24 = pref == null || pref.isNotify24Hours();
            boolean notify4 = pref == null || pref.isNotify4Hours();

            if (hoursUntilDue <= 4 && notify4) {
                sendEmail(
                        assignment.getUser().getEmail(),
                        "URGENT: " + assignment.getTitle() + " due in 4 hours!",
                        "Hi! " + assignment.getUser().getName() + ",\n\n" +
                                "Your assignment \"" + assignment.getTitle() + "\" for " +
                                assignment.getCourseName() + " is due in less than 4 hours.\n\n" +
                                "Have you submitted it yet? "
                );
            } else if (hoursUntilDue > 4 && hoursUntilDue <= 24 && notify24) {
                sendEmail(
                        assignment.getUser().getEmail(),
                        "Reminder: " + assignment.getTitle() + " due in 24 hours",
                        "Hi! " + assignment.getUser().getName() + ",\n\n" +
                                "Your assignment \"" + assignment.getTitle() + "\" for " +
                                assignment.getCourseName() + " is due in less than 24 hours. "
                );
            } else if (hoursUntilDue > 24 && hoursUntilDue <= 72 &&notify72) {
                sendEmail(
                        assignment.getUser().getEmail(),
                        "Upcoming: " + assignment.getTitle() + " due in 3 days",
                        "Hi " + assignment.getUser().getName() + ",\n\n" +
                                "Your assignment \"" + assignment.getTitle() + "\" for " +
                                assignment.getCourseName() + " is due in less than 72 hours. "
                );
                assignment.setLastNotifiedAt(now);
                assignmentRepository.save(assignment);
            }
        }
    }

    private void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("t51092567@gmail.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            logger.info("Email sent to: {} | Subject: {}", to, subject);
        } catch (Exception e) {
            logger.error("Failed to send email to: {} | Error: {}", to, e.getMessage());
        }
    }
}