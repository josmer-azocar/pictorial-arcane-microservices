package com.pictorial.audit_service.service;

import com.pictorial.audit_service.dto.request.SecurityLogByEventRequestDto;
import com.pictorial.audit_service.dto.response.SecurityLogByEventResponseDto;
import com.pictorial.audit_service.mapper.SecurityLogByEventMapper;
import com.pictorial.audit_service.persistence.repository.SecurityLogByEventRepository;
import com.pictorial.audit_service.persistence.tables.SecurityLogByEventKey;
import com.pictorial.audit_service.persistence.tables.SecurityLogByEventTable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class SecurityLogByEventService {

    private final SecurityLogByEventRepository repository;
    private final SecurityLogByEventMapper mapper;

    public SecurityLogByEventService(SecurityLogByEventRepository repository, SecurityLogByEventMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public SecurityLogByEventResponseDto create(SecurityLogByEventRequestDto dto) {
        SecurityLogByEventTable table = mapper.toTable(dto);
        SecurityLogByEventTable saved = repository.save(table);
        return mapper.toResponseDto(saved);
    }

    public List<SecurityLogByEventResponseDto> getAll() {
        List<SecurityLogByEventTable> list = repository.findAll();
        return mapper.toResponseDtoList(list);
    }

    public List<SecurityLogByEventResponseDto> getByEventTypeAndEventDate(String eventType, LocalDate eventDate) {
        List<SecurityLogByEventTable> list = repository.findByKeyEventTypeAndKeyEventDate(eventType, eventDate);
        return mapper.toResponseDtoList(list);
    }

    public SecurityLogByEventResponseDto getById(String eventType, LocalDate eventDate, Instant eventTime, UUID eventId) {
        SecurityLogByEventKey key = new SecurityLogByEventKey(eventType, eventDate, eventTime, eventId);
        SecurityLogByEventTable table = repository.findById(key)
                .orElseThrow(() -> new com.pictorial.audit_service.exception.ResourceNotFoundException(
                        "security-log-by-event",
                        "Security log record not found for eventType: " + eventType + ", eventDate: " + eventDate + ", eventTime: " + eventTime + ", eventId: " + eventId));
        return mapper.toResponseDto(table);
    }

    public void delete(String eventType, LocalDate eventDate, Instant eventTime, UUID eventId) {
        SecurityLogByEventKey key = new SecurityLogByEventKey(eventType, eventDate, eventTime, eventId);
        if (!repository.existsById(key)) {
            throw new com.pictorial.audit_service.exception.ResourceNotFoundException(
                    "security-log-by-event",
                    "Security log record not found for eventType: " + eventType + ", eventDate: " + eventDate + ", eventTime: " + eventTime + ", eventId: " + eventId);
        }
        repository.deleteById(key);
    }
}
