package com.canvastracker.canvas_tracker.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendVerificationEmail(String toEmail, String name, String verifyUrl) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("t51092567@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Verify your ClassSync account");
        message.setText("Hi " + name + ",\n\nClick this link to verify your account:\n" + verifyUrl);

        mailSender.send(message);
    }
}
