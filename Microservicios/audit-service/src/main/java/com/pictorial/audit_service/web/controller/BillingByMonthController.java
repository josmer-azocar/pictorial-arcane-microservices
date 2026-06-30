package com.pictorial.audit_service.web.controller;

import com.pictorial.audit_service.dto.request.BillingByMonthRequestDto;
import com.pictorial.audit_service.dto.response.BillingByMonthResponseDto;
import com.pictorial.audit_service.service.BillingByMonthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/billing-by-month")
public class BillingByMonthController {

    private final BillingByMonthService service;

    public BillingByMonthController(BillingByMonthService service) {
        this.service = service;
    }

    // Escritura interna desde core-service (lb://, sin token): debe permanecer abierta.
    @PreAuthorize("permitAll()")
    @PostMapping("/add")
    public ResponseEntity<BillingByMonthResponseDto> create(@RequestBody @Valid BillingByMonthRequestDto dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<BillingByMonthResponseDto>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/month/{yearMonth}")
    public ResponseEntity<List<BillingByMonthResponseDto>> getByYearMonth(@PathVariable String yearMonth) {
        return ResponseEntity.ok(service.getByYearMonth(yearMonth));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/find")
    public ResponseEntity<BillingByMonthResponseDto> getById(
            @RequestParam String yearMonth,
            @RequestParam LocalDate saleDate,
            @RequestParam Long saleId) {
        return ResponseEntity.ok(service.getById(yearMonth, saleDate, saleId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/period")
    public ResponseEntity<List<BillingByMonthResponseDto>> getByPeriod(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        return ResponseEntity.ok(service.getByPeriod(startDate, endDate));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete")
    public ResponseEntity<Void> delete(
            @RequestParam String yearMonth,
            @RequestParam LocalDate saleDate,
            @RequestParam Long saleId) {
        service.delete(yearMonth, saleDate, saleId);
        return ResponseEntity.noContent().build();
    }
}
