package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;





import java.time.LocalDateTime;
import java.util.*;

@Service
public class AIService {

    @Value("${ai.api.key}")
    private String apiKey;

    @Autowired
    private AlertRepository alertRepository;

    public void generateAndSaveSuggestion(Student student, String subject, double percentage) {
        try {
            String suggestion = callGeminiAPI(subject, percentage);

            Alert alert = new Alert();
            alert.setStudent(student);
            alert.setType("AI_SUGGESTION");
            alert.setMessage("AI Suggestion for " + subject + ": " + suggestion);
            alert.setRead(false);
            alert.setCreatedAt(LocalDateTime.now());
            alertRepository.save(alert);

        } catch (Exception e) {
            System.out.println("AI API call failed: " + e.getMessage());
        }
    }

    public String callGeminiAPI(String subject, double percentage) {
        String prompt = "A student scored " + String.format("%.1f", percentage)
                + "% in " + subject
                + ". Give exactly 3 short practical tips to help them improve. "
                + "Keep each tip under 20 words.";

        RestTemplate restTemplate = new RestTemplate();

        String url = "https://generativelanguage.googleapis.com/v1beta/models/"
                + "gemini-pro:generateContent?key=" + apiKey;

        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", List.of(part));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, Map.class);

        return extractText(response.getBody());
    }

    @SuppressWarnings("unchecked")
    private String extractText(Map body) {
        List<Map> candidates = (List<Map>) body.get("candidates");
        Map contentMap = (Map) candidates.get(0).get("content");
        List<Map> parts = (List<Map>) contentMap.get("parts");
        return (String) parts.get(0).get("text");
    }
}