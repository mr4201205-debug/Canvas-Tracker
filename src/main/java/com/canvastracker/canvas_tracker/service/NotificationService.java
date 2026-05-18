package com.canvastracker.canvas_tracker.service;

import com.canvastracker.canvas_tracker.model.Assignment;
import com.canvastracker.canvas_tracker.repository.AssignmentRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class NotificationService {

    private final AssignmentRepository assignmentRepository;
    private final CanvasApiService canvasApiService;
    private final JavaMailSender mailSender;
    private static final org.slf4j.Logger logger =
            org.slf4j.LoggerFactory.getLogger(NotificationService.class);

    public NotificationService(AssignmentRepository assignmentRepository,
                               CanvasApiService canvasApiService,
                               JavaMailSender mailSender) {
        this.assignmentRepository = assignmentRepository;
        this.canvasApiService = canvasApiService;
        this.mailSender = mailSender;
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

            if (hoursUntilDue <= 4) {
                sendEmail(
                        assignment.getUser().getEmail(),
                        "URGENT: " + assignment.getTitle() + " due in 4 hours!",
                        "Hi! " + assignment.getUser().getName() + ",\n\n" +
                                "Your assignment \"" + assignment.getTitle() + "\" for " +
                                assignment.getCourseName() + " is due in less than 4 hours.\n\n" +
                                "Have you submitted it yet? "
                );
            } else if (hoursUntilDue <= 24) {
                sendEmail(
                        assignment.getUser().getEmail(),
                        "Reminder: " + assignment.getTitle() + " due in 24 hours",
                        "Hi! " + assignment.getUser().getName() + ",\n\n" +
                                "Your assignment \"" + assignment.getTitle() + "\" for " +
                                assignment.getCourseName() + " is due in less than 24 hours. "
                );
            } else if (hoursUntilDue <= 72) {
                sendEmail(
                        assignment.getUser().getEmail(),
                        "Upcoming: " + assignment.getTitle() + " due in 3 days",
                        "Hi " + assignment.getUser().getName() + ",\n\n" +
                                "Your assignment \"" + assignment.getTitle() + "\" for " +
                                assignment.getCourseName() + " is due in less than 72 hours. "
                );
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