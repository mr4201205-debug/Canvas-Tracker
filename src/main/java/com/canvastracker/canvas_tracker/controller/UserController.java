package com.canvastracker.canvas_tracker.controller;


import com.canvastracker.canvas_tracker.model.User;
import com.canvastracker.canvas_tracker.service.UserService;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/users")

public class UserController {
    private final UserService userService;
    private final com.canvastracker.canvas_tracker.repository.UserRepository userRepository;


    public UserController(UserService userService,
                          com.canvastracker.canvas_tracker.repository.UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }




    @GetMapping("/me")
    public User getCurrentUser(org.springframework.security.core.Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
