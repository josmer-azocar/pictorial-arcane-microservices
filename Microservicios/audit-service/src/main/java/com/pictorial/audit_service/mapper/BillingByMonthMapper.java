package com.pictorial.audit_service.mapper;

import com.pictorial.audit_service.dto.request.BillingByMonthRequestDto;
import com.pictorial.audit_service.dto.response.BillingByMonthResponseDto;
import com.pictorial.audit_service.persistence.tables.BillingByMonthTable;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BillingByMonthMapper {

    @Mapping(source = "key.yearMonth", target = "yearMonth")
    @Mapping(source = "key.saleDate", target = "saleDate")
    @Mapping(source = "key.saleId", target = "saleId")
    BillingByMonthResponseDto toResponseDto(BillingByMonthTable table);

    List<BillingByMonthResponseDto> toResponseDtoList(List<BillingByMonthTable> tables);

    @Mapping(source = "saleId", target = "key.saleId")
    @Mapping(source = "saleDate", target = "key.saleDate")
    @Mapping(source = "saleDate", target = "key.yearMonth", qualifiedByName = "toYearMonth")
    @Mapping(target = "createdAt", expression = "java(java.time.Instant.now())")
    @Mapping(target = "modifiedAt", expression = "java(java.time.Instant.now())")
    BillingByMonthTable toTable(BillingByMonthRequestDto dto);

    @Named("toYearMonth")
    default String toYearMonth(LocalDate saleDate) {
        if (saleDate == null) {
            return null;
        }
        return saleDate.format(DateTimeFormatter.ofPattern("yyyy-MM"));
    }
}
