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

    @Async
    public void sendTokenExpiredEmail(String toEmail, String name, String canvasBaseUrl) {
        String html = "<h2>Action Required: Reconnect your Canvas account</h2>" +
                "<p>Hi " + name + ",</p>" +
                "<p>Your Canvas API token has expired and ClassSync can no longer sync your assignments.</p>" +
                "<p>To reconnect, follow these steps:</p>" +
                "<ol>" +
                "<li>Go to your <a href='https://" + canvasBaseUrl + "/profile/settings'>Canvas Profile Settings</a></li>" +
                "<li>Scroll down to <strong>Approved Integrations</strong></li>" +
                "<li>Click <strong>New Access Token</strong></li>" +
                "<li>Set a purpose like 'ClassSync', generate the token, and set the furthest due date</li>" +
                "<li>Copy the token immediately, Canvas only shows it once</li>" +
                "<li>Go to <a href='https://classsync33.netlify.app/settings'>ClassSync Settings</a></li>" +
                "<li>Paste the token in the Canvas API Token field and click 'Save Changes'</li>" +
                "</ol>" +
                "<p>If you need help, reply to this email.</p>" +
                "<p>ClassSync</p>";
        sendEmail(toEmail, "Action required: Your Canvas token has expired", html);
    }

}