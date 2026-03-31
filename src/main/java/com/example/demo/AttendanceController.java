package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;





import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping
    public ResponseEntity<Attendance> addAttendance(@RequestBody AttendanceDTO dto) {
        return ResponseEntity.ok(attendanceService.saveAttendance(dto));
    }

    @GetMapping("/student/{id}")
    public ResponseEntity<List<Attendance>> getAttendanceByStudent(@PathVariable Long id) {
        return ResponseEntity.ok(attendanceService.getAttendanceByStudent(id));
    }

    @GetMapping
    public ResponseEntity<List<Attendance>> getAllAttendance() {
        return ResponseEntity.ok(attendanceService.getAllAttendance());
    }
}