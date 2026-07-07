package com.canvastracker.canvas_tracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@EnableAsync
@SpringBootApplication
public class CanvasTrackerApplication {

	public static void main(String[] args) {
		SpringApplication.run(CanvasTrackerApplication.class, args);
	}

}
