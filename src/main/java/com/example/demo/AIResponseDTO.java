package com.example.demo;

public class AIResponseDTO {

    private Long studentId;
    private String subject;
    private double percentage;
    private String suggestion;

    public Long getStudentId() { return studentId; }
    public String getSubject() { return subject; }
    public double getPercentage() { return percentage; }
    public String getSuggestion() { return suggestion; }

    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public void setSubject(String subject) { this.subject = subject; }
    public void setPercentage(double percentage) { this.percentage = percentage; }
    public void setSuggestion(String suggestion) { this.suggestion = suggestion; }
}