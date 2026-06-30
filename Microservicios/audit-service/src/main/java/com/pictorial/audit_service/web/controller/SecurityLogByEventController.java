package com.pictorial.audit_service.web.controller;

import com.pictorial.audit_service.dto.request.SecurityLogByEventRequestDto;
import com.pictorial.audit_service.dto.response.SecurityLogByEventResponseDto;
import com.pictorial.audit_service.service.SecurityLogByEventService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    // Escritura interna desde core-service (lb://, sin token): debe permanecer abierta.
    @PreAuthorize("permitAll()")
    @PostMapping("/add")
    public ResponseEntity<SecurityLogByEventResponseDto> create(@RequestBody @Valid SecurityLogByEventRequestDto dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<SecurityLogByEventResponseDto>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/event/{eventType}/{eventDate}")
    public ResponseEntity<List<SecurityLogByEventResponseDto>> getByEventTypeAndEventDate(
            @PathVariable String eventType,
            @PathVariable LocalDate eventDate) {
        return ResponseEntity.ok(service.getByEventTypeAndEventDate(eventType, eventDate));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/find")
    public ResponseEntity<SecurityLogByEventResponseDto> getById(
            @RequestParam String eventType,
            @RequestParam LocalDate eventDate,
            @RequestParam Instant eventTime,
            @RequestParam UUID eventId) {
        return ResponseEntity.ok(service.getById(eventType, eventDate, eventTime, eventId));
    }

    @PreAuthorize("hasRole('ADMIN')")
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
