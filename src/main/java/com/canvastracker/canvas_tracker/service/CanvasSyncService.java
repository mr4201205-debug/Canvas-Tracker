package com.canvastracker.canvas_tracker.service;

import com.canvastracker.canvas_tracker.model.Assignment;
import com.canvastracker.canvas_tracker.repository.AssignmentRepository;
import com.canvastracker.canvas_tracker.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class CanvasSyncService {

    private final CanvasApiService canvasApiService;
    private final AssignmentRepository assignmentRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private static final org.slf4j.Logger logger =
            org.slf4j.LoggerFactory.getLogger(CanvasSyncService.class);

    public CanvasSyncService(CanvasApiService canvasApiService,
                             AssignmentRepository assignmentRepository,
                             UserRepository userRepository) {
        this.canvasApiService = canvasApiService;
        this.assignmentRepository = assignmentRepository;
        this.userRepository = userRepository;
        this.objectMapper = new ObjectMapper();
    }

    public void syncAssignments(Long userId) {

        userRepository.findById(userId).ifPresent(user -> {

            String token = user.getCanvasToken();
            String canvasUrl = user.getCanvasBaseUrl();

            if (token == null || canvasUrl == null || token.isEmpty() || canvasUrl.isEmpty()) {
                logger.info("Skipping sync for user {} - missing Canvas credentials", userId);
                return;
            }

            String coursesJson = canvasApiService.getCourses(user.getCanvasBaseUrl(), user.getCanvasToken());
            try {
                JsonNode courses = objectMapper.readTree(coursesJson);

                for (JsonNode course : courses) {
                    String courseId = course.get("id").asText();
                    String courseName = course.get("name").asText();

                    String assignmentsJson = canvasApiService.getAssignments(user.getCanvasBaseUrl(), user.getCanvasToken(), courseId);                    JsonNode assignments = objectMapper.readTree(assignmentsJson);

                    for (JsonNode a : assignments) {
                        String canvasAssignmentId = a.get("id").asText();
                        String dueAtStr = a.get("due_at").asText();

                        if (dueAtStr.equals("null") || dueAtStr.isEmpty()) {
                            continue;
                        }

                        LocalDateTime dueDate = LocalDateTime.parse(
                                dueAtStr, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'")
                        );

                        if (dueDate.isBefore(LocalDateTime.now())) {
                            continue;
                        }

                        boolean alreadyExists = assignmentRepository
                                .findByUserId(userId)
                                .stream()
                                .anyMatch(existing -> existing.getTitle().equals(a.get("name").asText())
                                        && existing.getCourseName().equals(courseName));

                        if (alreadyExists) {
                            continue;
                        }

                        Assignment assignment = new Assignment();
                        assignment.setTitle(a.get("name").asText());
                        assignment.setCourseName(courseName);
                        assignment.setDueDate(dueDate);
                        assignment.setPoints(a.get("points_possible").asDouble());
                        assignment.setSubmitted(false);
                        assignment.setUser(user);

                        assignmentRepository.save(assignment);
                    }
                }
            } catch (JsonProcessingException e) {
                System.out.println("Error parsing Canvas data: " + e.getMessage());
            }
        });
    }
}