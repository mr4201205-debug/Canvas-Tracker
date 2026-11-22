package com.canvastracker.canvas_tracker.service;


import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class CanvasApiService{

    public CanvasApiService() {
    }

    private WebClient buildClient(String baseUrl, String token) {
        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(configurer -> configurer
                        .defaultCodecs()
                        .maxInMemorySize(16*1024*1024))
                .build();
        return WebClient.builder()
                .baseUrl("https://" + baseUrl)
                .defaultHeader("Authorization", "Bearer " + token)
                .exchangeStrategies(strategies)
                .build();
    }


    public String getCourses(String baseUrl, String token) {
        return buildClient(baseUrl, token)
                .get()
                .uri("/api/v1/courses?enrollment_state=active&enrollment_type=student&per_page=50")
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }


    public String getAssignments(String baseUrl, String token, String courseId) {
        return buildClient(baseUrl, token)
                .get()
                .uri("/api/v1/courses/" + courseId + "/assignments?per_page=50&include[]=submission")
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}