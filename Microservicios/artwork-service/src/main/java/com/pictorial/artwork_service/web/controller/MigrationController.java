package com.pictorial.artwork_service.web.controller;

import com.pictorial.artwork_service.service.MigrationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/migrate")
public class MigrationController {

    private final MigrationService migrationService;

    public MigrationController(MigrationService migrationService) {
        this.migrationService = migrationService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> migrate(
            @RequestParam(defaultValue = "jdbc:postgresql://localhost:5432/pictorial_arcane_db") String dbUrl,
            @RequestParam(defaultValue = "uneg") String dbUser,
            @RequestParam(defaultValue = "uneg2026") String dbPassword) {
        Map<String, Object> result = migrationService.migrate(dbUrl, dbUser, dbPassword);
        if ("error".equals(result.get("status"))) {
            return ResponseEntity.internalServerError().body(result);
        }
        return ResponseEntity.ok(result);
    }
}
