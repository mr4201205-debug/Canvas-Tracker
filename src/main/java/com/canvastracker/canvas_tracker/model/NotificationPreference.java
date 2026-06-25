package com.canvastracker.canvas_tracker.model;

import jakarta.persistence.*;

@Entity
@Table(name = "notification_preferences")
public class NotificationPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private boolean notify72Hours = true;
    private boolean notify24Hours = true;
    private boolean notify4Hours = true;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Long getId() { return id; } //long means I am getting all ID's
    public boolean isNotify72Hours() { return notify72Hours; }
    public boolean isNotify24Hours() { return notify24Hours; }
    public boolean isNotify4Hours() { return notify4Hours; }
    public User getUser() { return user; }

    public void setId(Long id) { this.id = id; }
    public void setNotify72Hours(boolean notify72Hours) { this.notify72Hours = notify72Hours; }
    public void setNotify24Hours(boolean notify24Hours) { this.notify24Hours = notify24Hours; }
    public void setNotify4Hours(boolean notify4Hours) { this.notify4Hours = notify4Hours; }
    public void setUser(User user) { this.user = user; }
}