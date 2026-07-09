package com.canvastracker.canvas_tracker.controller;

import com.canvastracker.canvas_tracker.model.User;
import com.canvastracker.canvas_tracker.repository.UserRepository;
import com.canvastracker.canvas_tracker.security.JwtService;
import com.canvastracker.canvas_tracker.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;


import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public AuthController(UserRepository userRepository,
                          JwtService jwtService,
                          PasswordEncoder passwordEncoder,
                          EmailService emailService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setVerified(false);
        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);
        userRepository.save(user);

        String verifyUrl = "https://canvas-tracker.onrender.com/auth/verify?token=" + token;

        emailService.sendVerificationEmail(user.getEmail(), user.getName(), verifyUrl);

        return ResponseEntity.ok("Registration successful. Please check your email to verify your account.");
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        return userRepository.findByVerificationToken(token).map(user -> {
            user.setVerified(true);
            user.setVerificationToken(null);
            userRepository.save(user);
            return ResponseEntity.ok("Email verified successfully. You can now log in.");
        }).orElse(ResponseEntity.badRequest().body("Invalid or expired verification token"));
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOptional.get();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid password");
        }

        if (!user.isVerified()) {
            return ResponseEntity.badRequest().body("Please verify your email before logging in.");
        }

        String token = jwtService.generateToken(email);
        return ResponseEntity.ok(token);
    }
}