package com.canvastracker.canvas_tracker.service;

import com.canvastracker.canvas_tracker.model.Assignment;
import com.canvastracker.canvas_tracker.repository.AssignmentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class NotificationService {

    private final AssignmentRepository assignmentRepository;
    private final CanvasApiService canvasApiService;

    public NotificationService(AssignmentRepository assignmentRepository,
                               CanvasApiService canvasApiService) {
        this.assignmentRepository = assignmentRepository;
        this.canvasApiService = canvasApiService;
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
                sendSmsReminder(assignment);
            } else if (hoursUntilDue <= 24) {
                sendSecondEmailReminder(assignment);
            } else if (hoursUntilDue <= 72) {
                sendEmailReminder(assignment);
            }
        }
    }

    private void sendEmailReminder(Assignment assignment) {
        System.out.println("EMAIL REMINDER: " + assignment.getTitle()
                + " for " + assignment.getCourseName()
                + " is due in 72 hours or less.");
    }

    private void sendSecondEmailReminder(Assignment assignment) {
        System.out.println("SECOND EMAIL REMINDER: " + assignment.getTitle()
                + " for " + assignment.getCourseName()
                + " is due in 24 hours or less.");
    }

    private void sendSmsReminder(Assignment assignment) {
        System.out.println("SMS REMINDER: " + assignment.getTitle()
                + " for " + assignment.getCourseName()
                + " is due in 4 hours or less. Have you submitted?");
    }
}