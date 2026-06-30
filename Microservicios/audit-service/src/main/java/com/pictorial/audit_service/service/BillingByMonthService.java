package com.pictorial.audit_service.service;

import com.pictorial.audit_service.dto.request.BillingByMonthRequestDto;
import com.pictorial.audit_service.dto.response.BillingByMonthResponseDto;
import com.pictorial.audit_service.mapper.BillingByMonthMapper;
import com.pictorial.audit_service.persistence.repository.BillingByMonthRepository;
import com.pictorial.audit_service.persistence.tables.BillingByMonthKey;
import com.pictorial.audit_service.persistence.tables.BillingByMonthTable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BillingByMonthService {

    private final BillingByMonthRepository repository;
    private final BillingByMonthMapper mapper;

    public BillingByMonthService(BillingByMonthRepository repository, BillingByMonthMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public BillingByMonthResponseDto create(BillingByMonthRequestDto dto) {
        if (dto.saleDate() != null) {
            String yearMonthStr = dto.saleDate().format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM"));
            BillingByMonthKey key = new BillingByMonthKey(yearMonthStr, dto.saleDate(), dto.saleId());
            if (repository.existsById(key)) {
                throw new com.pictorial.audit_service.exception.DuplicateResourceException(
                        "Billing record already exists for sale ID: " + dto.saleId() + " on " + dto.saleDate());
            }
        }
        BillingByMonthTable table = mapper.toTable(dto);
        BillingByMonthTable saved = repository.save(table);
        return mapper.toResponseDto(saved);
    }

    public List<BillingByMonthResponseDto> getAll() {
        List<BillingByMonthTable> list = repository.findAll();
        return mapper.toResponseDtoList(list);
    }

    public List<BillingByMonthResponseDto> getByYearMonth(String yearMonth) {
        List<BillingByMonthTable> list = repository.findByKeyYearMonth(yearMonth);
        return mapper.toResponseDtoList(list);
    }

    public BillingByMonthResponseDto getById(String yearMonth, LocalDate saleDate, Long saleId) {
        BillingByMonthKey key = new BillingByMonthKey(yearMonth, saleDate, saleId);
        BillingByMonthTable table = repository.findById(key)
                .orElseThrow(() -> new com.pictorial.audit_service.exception.ResourceNotFoundException(
                        "billing-by-month",
                        "Billing record not found for yearMonth: " + yearMonth + ", saleDate: " + saleDate + ", saleId: " + saleId));
        return mapper.toResponseDto(table);
    }

    public void delete(String yearMonth, LocalDate saleDate, Long saleId) {
        BillingByMonthKey key = new BillingByMonthKey(yearMonth, saleDate, saleId);
        if (!repository.existsById(key)) {
            throw new com.pictorial.audit_service.exception.ResourceNotFoundException(
                    "billing-by-month",
                    "Billing record not found for yearMonth: " + yearMonth + ", saleDate: " + saleDate + ", saleId: " + saleId);
        }
        repository.deleteById(key);
    }

    public List<BillingByMonthResponseDto> getByPeriod(LocalDate startDate, LocalDate endDate) {
        List<BillingByMonthTable> combinedList = new java.util.ArrayList<>();
        
        if (startDate == null || endDate == null || startDate.isAfter(endDate)) {
            return mapper.toResponseDtoList(combinedList);
        }

        java.time.YearMonth start = java.time.YearMonth.from(startDate);
        java.time.YearMonth end = java.time.YearMonth.from(endDate);

        java.time.YearMonth current = start;
        while (!current.isAfter(end)) {
            String yearMonthStr = current.toString();
            List<BillingByMonthTable> monthlyList = repository.findByKeyYearMonthAndKeySaleDateBetween(yearMonthStr, startDate, endDate);
            combinedList.addAll(monthlyList);
            current = current.plusMonths(1);
        }

        // Ordenar los resultados combinados de forma descendente por fecha de venta
        combinedList.sort((a, b) -> b.getKey().getSaleDate().compareTo(a.getKey().getSaleDate()));

        return mapper.toResponseDtoList(combinedList);
    }
}
