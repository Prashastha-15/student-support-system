package com.example.demo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String subject;
    private int totalClasses;
    private int attendedClasses;
    private double percentage;

    @ManyToOne
    @JoinColumn(name = "student_id")
    @JsonIgnoreProperties({"marksList", "attendanceList"})
    private Student student;

    public Long getId() { return id; }
    public String getSubject() { return subject; }
    public int getTotalClasses() { return totalClasses; }
    public int getAttendedClasses() { return attendedClasses; }
    public double getPercentage() { return percentage; }
    public Student getStudent() { return student; }

    public void setId(Long id) { this.id = id; }
    public void setSubject(String subject) { this.subject = subject; }
    public void setTotalClasses(int totalClasses) { this.totalClasses = totalClasses; }
    public void setAttendedClasses(int attendedClasses) { this.attendedClasses = attendedClasses; }
    public void setPercentage(double percentage) { this.percentage = percentage; }
    public void setStudent(Student student) { this.student = student; }
}