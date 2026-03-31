package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;





import java.util.List;

@RestController
@RequestMapping("/api/marks")
@CrossOrigin(origins = "*")
public class MarksController {

    @Autowired
    private MarksService marksService;

    @PostMapping
    public ResponseEntity<Marks> addMarks(@RequestBody MarksDTO dto) {
        return ResponseEntity.ok(marksService.saveMarks(dto));
    }

    @GetMapping("/student/{id}")
    public ResponseEntity<List<Marks>> getMarksByStudent(@PathVariable Long id) {
        return ResponseEntity.ok(marksService.getMarksByStudent(id));
    }

    @GetMapping
    public ResponseEntity<List<Marks>> getAllMarks() {
        return ResponseEntity.ok(marksService.getAllMarks());
    }
}