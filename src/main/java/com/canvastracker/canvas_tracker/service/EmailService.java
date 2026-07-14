package com.canvastracker.canvas_tracker.service;

import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class EmailService {

    private static final org.slf4j.Logger logger =
            org.slf4j.LoggerFactory.getLogger(EmailService.class);

    private final OkHttpClient client = new OkHttpClient();

    @Value("${resend.api.key}")
    private String apiKey;

    @Async
    public void sendVerificationEmail(String toEmail, String name, String verifyUrl) {
        String html = "<h2>Welcome to ClassSync</h2><p>Hi " + name + ",</p><p><a href='" + verifyUrl + "'>Click here to verify your account</a></p><p>ClassSync</p>";
        sendEmail(toEmail, "Verify your ClassSync account", html);
    }

    @Async
    public void sendNotificationEmail(String toEmail, String subject, String html) {
        sendEmail(toEmail, subject, html);
    }

    private void sendEmail(String toEmail, String subject, String html) {
        String json = """
        {
          "from": "onboarding@resend.dev",
          "to": ["%s"],
          "subject": "%s",
          "html": "%s"
        }
        """.formatted(toEmail, subject, html.replace("\"", "\\\"").replace("\n", ""));

        RequestBody body = RequestBody.create(
                json,
                MediaType.parse("application/json")
        );

        Request request = new Request.Builder()
                .url("https://api.resend.com/emails")
                .addHeader("Authorization", "Bearer " + apiKey)
                .addHeader("Content-Type", "application/json")
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (response.isSuccessful()) {
                logger.info("Email sent to: {} | Subject: {}", toEmail, subject);
            } else {
                logger.error("Resend error for {}: {}", toEmail, response.body().string());
            }
        } catch (IOException e) {
            logger.error("Failed to send email to: {} | Error: {}", toEmail, e.getMessage());
        }
    }
    @Async
    public void sendPasswordResetEmail(String toEmail, String name, String resetUrl) {
        String html = "<h2>Reset your ClassSync password</h2><p>Hi " + name + ",</p><p><a href='" + resetUrl + "'>Click here to reset your password</a></p><p>This link expires in 1 hour.</p><p>If you did not request this, ignore this email.</p><p>ClassSync</p>";
        sendEmail(toEmail, "Reset your ClassSync password", html);
    }

}