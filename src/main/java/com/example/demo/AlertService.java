package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;





import java.time.LocalDateTime;
import java.util.List;

@Service
public class AlertService {

    @Autowired
    private AlertRepository alertRepository;

    public void createAttendanceAlert(Student student, String subject, double percentage) {
        Alert alert = new Alert();
        alert.setStudent(student);
        alert.setType("ATTENDANCE");
        alert.setMessage("Warning: Your attendance in " + subject + " is "
                + String.format("%.1f", percentage) + "%. Minimum required is 75%.");
        alert.setRead(false);
        alert.setCreatedAt(LocalDateTime.now());
        alertRepository.save(alert);
    }

    public void createMarksAlert(Student student, String subject, double percentage) {
        Alert alert = new Alert();
        alert.setStudent(student);
        alert.setType("MARKS");
        alert.setMessage("Alert: You scored " + String.format("%.1f", percentage)
                + "% in " + subject + ". Please focus on improving this subject.");
        alert.setRead(false);
        alert.setCreatedAt(LocalDateTime.now());
        alertRepository.save(alert);
    }

    public List<Alert> getUnreadAlerts(Long studentId) {
        return alertRepository.findByStudentIdAndIsReadFalse(studentId);
    }

    public List<Alert> getAllAlerts(Long studentId) {
        return alertRepository.findByStudentId(studentId);
    }

    public void markAsRead(Long alertId) {
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found"));
        alert.setRead(true);
        alertRepository.save(alert);
    }
}