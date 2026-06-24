package com.pictorial.recommendation_service.controller;

import com.pictorial.recommendation_service.core.service.RecommendationTestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationTestController {

    private final RecommendationTestService testService;

    public RecommendationTestController(RecommendationTestService testService) {
        this.testService = testService;
    }

    @GetMapping("/test-connection")
    public ResponseEntity<Map<String, Object>> testNeo4jConnection() {
        Map<String, Object> response = testService.verifyDatabaseConnection();

        if ("ERROR".equals(response.get("status"))) {
            return ResponseEntity.status(500).body(response);
        }

        return ResponseEntity.ok(response);
    }
}