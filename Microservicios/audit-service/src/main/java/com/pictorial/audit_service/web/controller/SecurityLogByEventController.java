package com.pictorial.audit_service.web.controller;

import com.pictorial.audit_service.dto.request.SecurityLogByEventRequestDto;
import com.pictorial.audit_service.dto.response.SecurityLogByEventResponseDto;
import com.pictorial.audit_service.service.SecurityLogByEventService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/security-log-by-event")
public class SecurityLogByEventController {

    private final SecurityLogByEventService service;

    public SecurityLogByEventController(SecurityLogByEventService service) {
        this.service = service;
    }

    @PostMapping("/add")
    public ResponseEntity<SecurityLogByEventResponseDto> create(@RequestBody @Valid SecurityLogByEventRequestDto dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @GetMapping("/all")
    public ResponseEntity<List<SecurityLogByEventResponseDto>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/event/{eventType}/{eventDate}")
    public ResponseEntity<List<SecurityLogByEventResponseDto>> getByEventTypeAndEventDate(
            @PathVariable String eventType,
            @PathVariable LocalDate eventDate) {
        return ResponseEntity.ok(service.getByEventTypeAndEventDate(eventType, eventDate));
    }

    @GetMapping("/find")
    public ResponseEntity<SecurityLogByEventResponseDto> getById(
            @RequestParam String eventType,
            @RequestParam LocalDate eventDate,
            @RequestParam Instant eventTime,
            @RequestParam UUID eventId) {
        return ResponseEntity.ok(service.getById(eventType, eventDate, eventTime, eventId));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> delete(
            @RequestParam String eventType,
            @RequestParam LocalDate eventDate,
            @RequestParam Instant eventTime,
            @RequestParam UUID eventId) {
        service.delete(eventType, eventDate, eventTime, eventId);
        return ResponseEntity.noContent().build();
    }
}
