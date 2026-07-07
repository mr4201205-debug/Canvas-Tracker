package com.canvastracker.canvas_tracker.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "users")

public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String canvasToken;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    private String canvasBaseUrl;
    private boolean isVerified = false;
    private String verificationToken;

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getCanvasToken() { return canvasToken; }
    public String getCanvasBaseUrl() { return canvasBaseUrl; }
    public boolean isVerified() { return isVerified; }
    public String getVerificationToken() { return verificationToken; }

    public String getPassword(){return password;}

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setCanvasToken(String canvasToken) { this.canvasToken = canvasToken; }
    public void setCanvasBaseUrl(String canvasBaseUrl) { this.canvasBaseUrl = canvasBaseUrl; }
    public void setPassword(String password){this.password = password;}
    public void setVerified(boolean verified) { isVerified = verified; }
    public void setVerificationToken(String verificationToken) { this.verificationToken = verificationToken; }
}
