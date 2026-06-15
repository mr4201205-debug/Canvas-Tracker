package com.canvastracker.canvas_tracker.service;


import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class CanvasApiService{

    public CanvasApiService() {
    }

    private WebClient buildClient(String baseUrl, String token) {
        return WebClient.builder()
                .baseUrl("https://" + baseUrl)
                .defaultHeader("Authorization", "Bearer " + token)
                .build();
    }


    public String getCourses(String baseUrl, String token) {
        return buildClient(baseUrl, token)
                .get()
                .uri("/api/v1/courses?enrollment_state=active&per_page=50")
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }


    public String getAssignments(String baseUrl, String token, String courseId) {
        return buildClient(baseUrl, token)
                .get()
                .uri("/api/v1/courses/" + courseId + "/assignments?per_page=50")
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}