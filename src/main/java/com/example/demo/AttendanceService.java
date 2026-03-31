package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;







import java.util.List;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AlertService alertService;

    public Attendance saveAttendance(AttendanceDTO dto) {
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        double percentage = ((double) dto.getAttendedClasses() / dto.getTotalClasses()) * 100;

        Attendance attendance = new Attendance();
        attendance.setStudent(student);
        attendance.setSubject(dto.getSubject());
        attendance.setTotalClasses(dto.getTotalClasses());
        attendance.setAttendedClasses(dto.getAttendedClasses());
        attendance.setPercentage(percentage);

        Attendance saved = attendanceRepository.save(attendance);

        if (percentage < 75) {
            alertService.createAttendanceAlert(student, dto.getSubject(), percentage);
        }

        return saved;
    }

    public List<Attendance> getAttendanceByStudent(Long studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }
}