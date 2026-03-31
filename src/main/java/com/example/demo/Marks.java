package com.example.demo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
public class Marks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String subject;
    private double score;
    private double maxScore;
    private String semester;

    @ManyToOne
    @JoinColumn(name = "student_id")
    @JsonIgnoreProperties({"marksList", "attendanceList"})
    private Student student;

    public Long getId() { return id; }
    public String getSubject() { return subject; }
    public double getScore() { return score; }
    public double getMaxScore() { return maxScore; }
    public String getSemester() { return semester; }
    public Student getStudent() { return student; }

    public void setId(Long id) { this.id = id; }
    public void setSubject(String subject) { this.subject = subject; }
    public void setScore(double score) { this.score = score; }
    public void setMaxScore(double maxScore) { this.maxScore = maxScore; }
    public void setSemester(String semester) { this.semester = semester; }
    public void setStudent(Student student) { this.student = student; }
}