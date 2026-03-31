package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;



import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByStudentIdAndIsReadFalse(Long studentId);
    List<Alert> findByStudentId(Long studentId);
}