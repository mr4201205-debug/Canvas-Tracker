package com.canvastracker.canvas_tracker.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class CanvasApiService {

    private final WebClient webClient;

    public CanvasApiService(@Value("${canvas.api.baseUrl}") String baseUrl,
                            @Value("${canvas.api.token}") String token) {
        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("Authorization", "Bearer " + token)
                .build();
    }

    public String getCourses() {
        return webClient.get()
                .uri("/api/v1/courses?enrollment_state=active&per_page=50")
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String getAssignments(String courseId) {
        return webClient.get()
                .uri("/api/v1/courses/" + courseId + "/assignments?per_page=50")
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}