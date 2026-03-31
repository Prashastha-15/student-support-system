package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    @Autowired
    private AIService aiService;

    @GetMapping("/suggest")
    public ResponseEntity<String> getSuggestion(
            @RequestParam String subject,
            @RequestParam double percentage) {
        String result = aiService.callGeminiAPI(subject, percentage);
        return ResponseEntity.ok(result);
    }
}