package com.example.demo;

public class AttendanceDTO {

    private Long studentId;
    private String subject;
    private int totalClasses;
    private int attendedClasses;

    public Long getStudentId() { return studentId; }
    public String getSubject() { return subject; }
    public int getTotalClasses() { return totalClasses; }
    public int getAttendedClasses() { return attendedClasses; }

    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public void setSubject(String subject) { this.subject = subject; }
    public void setTotalClasses(int totalClasses) { this.totalClasses = totalClasses; }
    public void setAttendedClasses(int attendedClasses) { this.attendedClasses = attendedClasses; }
}