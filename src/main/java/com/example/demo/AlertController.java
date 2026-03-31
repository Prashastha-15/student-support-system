package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;




import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
public class AlertController {

    @Autowired
    private AlertService alertService;

    @GetMapping("/student/{id}")
    public ResponseEntity<List<Alert>> getAllAlerts(@PathVariable Long id) {
        return ResponseEntity.ok(alertService.getAllAlerts(id));
    }

    @GetMapping("/student/{id}/unread")
    public ResponseEntity<List<Alert>> getUnreadAlerts(@PathVariable Long id) {
        return ResponseEntity.ok(alertService.getUnreadAlerts(id));
    }

    @PutMapping("/{alertId}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long alertId) {
        alertService.markAsRead(alertId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Alert marked as read");
        return ResponseEntity.ok(response);
    }
}