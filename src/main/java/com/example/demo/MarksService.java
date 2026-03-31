package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;







import java.util.List;

@Service
public class MarksService {

    @Autowired
    private MarksRepository marksRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AIService aiService;

    @Autowired
    private AlertService alertService;

    public Marks saveMarks(MarksDTO dto) {
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Marks marks = new Marks();
        marks.setStudent(student);
        marks.setSubject(dto.getSubject());
        marks.setScore(dto.getScore());
        marks.setMaxScore(dto.getMaxScore());
        marks.setSemester(dto.getSemester());

        Marks saved = marksRepository.save(marks);

        double percentage = (dto.getScore() / dto.getMaxScore()) * 100;
        if (percentage < 50) {
            aiService.generateAndSaveSuggestion(student, dto.getSubject(), percentage);
            alertService.createMarksAlert(student, dto.getSubject(), percentage);
        }

        return saved;
    }

    public List<Marks> getMarksByStudent(Long studentId) {
        return marksRepository.findByStudentId(studentId);
    }

    public List<Marks> getAllMarks() {
        return marksRepository.findAll();
    }
}