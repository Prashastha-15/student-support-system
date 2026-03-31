package com.example.demo;

public class MarksDTO {

    private Long studentId;
    private String subject;
    private double score;
    private double maxScore;
    private String semester;

    public Long getStudentId() { return studentId; }
    public String getSubject() { return subject; }
    public double getScore() { return score; }
    public double getMaxScore() { return maxScore; }
    public String getSemester() { return semester; }

    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public void setSubject(String subject) { this.subject = subject; }
    public void setScore(double score) { this.score = score; }
    public void setMaxScore(double maxScore) { this.maxScore = maxScore; }
    public void setSemester(String semester) { this.semester = semester; }
}