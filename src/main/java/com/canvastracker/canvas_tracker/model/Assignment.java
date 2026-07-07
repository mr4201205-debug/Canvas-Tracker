package com.canvastracker.canvas_tracker.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "assignments")

public class Assignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String courseName;
    private LocalDateTime dueDate;
    private Double points;
    private Double gradeWeight;
    private boolean submitted;

    private java.time.LocalDateTime lastNotifiedAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Long getId() {return id;}
    public String getTitle() {return title;}
    public String getCourseName() {return courseName;}
    public LocalDateTime getDueDate() {return dueDate;}
    public Double getPoints() { return points; }
    public Double getGradeWeight() { return gradeWeight; }
    public boolean isSubmitted() { return submitted; }
    public User getUser() { return user; }
    public java.time.LocalDateTime getLastNotifiedAt() { return lastNotifiedAt; }


    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setCourseName(String courseName) { this.courseName = courseName; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }
    public void setPoints(Double points) { this.points = points; }
    public void setGradeWeight(Double gradeWeight) { this.gradeWeight = gradeWeight; }
    public void setSubmitted(boolean submitted) { this.submitted = submitted; }
    public void setUser(User user) { this.user = user; }
    public void setLastNotifiedAt(java.time.LocalDateTime lastNotifiedAt) { this.lastNotifiedAt = lastNotifiedAt; }

}
