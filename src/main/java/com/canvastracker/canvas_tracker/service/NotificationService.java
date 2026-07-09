package com.canvastracker.canvas_tracker.service;

import com.canvastracker.canvas_tracker.model.Assignment;
import com.canvastracker.canvas_tracker.model.NotificationPreference;
import com.canvastracker.canvas_tracker.repository.AssignmentRepository;
import com.canvastracker.canvas_tracker.repository.NotificationPreferenceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class NotificationService {

    private static final org.slf4j.Logger logger =
            org.slf4j.LoggerFactory.getLogger(NotificationService.class);

    private final AssignmentRepository assignmentRepository;
    private final EmailService emailService;
    private final NotificationPreferenceRepository notificationPreferenceRepository;

    public NotificationService(AssignmentRepository assignmentRepository,
                               EmailService emailService,
                               NotificationPreferenceRepository notificationPreferenceRepository) {
        this.assignmentRepository = assignmentRepository;
        this.emailService = emailService;
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
                long hoursSinceLastEmail =
                        ChronoUnit.HOURS.between(lastNotified, now);

                // Prevent duplicate 72h and 24h reminders
                if (hoursUntilDue > 4 && hoursSinceLastEmail < 23) {
                    continue;
                }

                // Allow another urgent reminder every 3 hours
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

            String userEmail = assignment.getUser().getEmail();
            String userName = assignment.getUser().getName();
            String title = assignment.getTitle();
            String course = assignment.getCourseName();

            if (hoursUntilDue <= 4 && notify4) {

                emailService.sendNotificationEmail(
                        userEmail,
                        "URGENT: " + title + " due in 4 hours!",
                        "<h2>Urgent Reminder</h2>"
                                + "<p>Hi " + userName + ",</p>"
                                + "<p>Your assignment <strong>" + title
                                + "</strong> for <strong>" + course
                                + "</strong> is due in less than <strong>4 hours</strong>.</p>"
                                + "<p>Have you submitted it yet?</p>"
                                + "<p>ClassSync</p>"
                );

                assignment.setLastNotifiedAt(now);
                assignmentRepository.save(assignment);

                logger.info("Sent 4-hour reminder for assignment {}", assignment.getId());

            } else if (hoursUntilDue > 4 && hoursUntilDue <= 24 && notify24) {

                emailService.sendNotificationEmail(
                        userEmail,
                        "Reminder: " + title + " due in 24 hours",
                        "<h2>Assignment Reminder</h2>"
                                + "<p>Hi " + userName + ",</p>"
                                + "<p>Your assignment <strong>" + title
                                + "</strong> for <strong>" + course
                                + "</strong> is due in less than <strong>24 hours</strong>.</p>"
                                + "<p>ClassSync</p>"
                );

                assignment.setLastNotifiedAt(now);
                assignmentRepository.save(assignment);

                logger.info("Sent 24-hour reminder for assignment {}", assignment.getId());

            } else if (hoursUntilDue > 24 && hoursUntilDue <= 72 && notify72) {

                emailService.sendNotificationEmail(
                        userEmail,
                        "Upcoming: " + title + " due in 3 days",
                        "<h2>Upcoming Assignment</h2>"
                                + "<p>Hi " + userName + ",</p>"
                                + "<p>Your assignment <strong>" + title
                                + "</strong> for <strong>" + course
                                + "</strong> is due in less than <strong>72 hours</strong>.</p>"
                                + "<p>ClassSync</p>"
                );

                assignment.setLastNotifiedAt(now);
                assignmentRepository.save(assignment);

                logger.info("Sent 72-hour reminder for assignment {}", assignment.getId());
            }
        }
    }
}