package com.pictorial.audit_service.mapper;

import com.pictorial.audit_service.dto.request.SecurityLogByEventRequestDto;
import com.pictorial.audit_service.dto.response.SecurityLogByEventResponseDto;
import com.pictorial.audit_service.persistence.tables.SecurityLogByEventTable;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SecurityLogByEventMapper {

    @Mapping(source = "key.eventType", target = "eventType")
    @Mapping(source = "key.eventDate", target = "eventDate")
    @Mapping(source = "key.eventTime", target = "eventTime")
    @Mapping(source = "key.eventId", target = "eventId")
    @Mapping(source = "ipAddress", target = "ipAddress")
    SecurityLogByEventResponseDto toResponseDto(SecurityLogByEventTable table);

    List<SecurityLogByEventResponseDto> toResponseDtoList(List<SecurityLogByEventTable> tables);

    @Mapping(source = "eventType", target = "key.eventType")
    @Mapping(target = "key.eventDate", expression = "java(java.time.LocalDate.now())")
    @Mapping(target = "key.eventTime", expression = "java(java.time.Instant.now())")
    @Mapping(target = "key.eventId", expression = "java(java.util.UUID.randomUUID())")
    @Mapping(source = "ipAddress", target = "ipAddress")
    SecurityLogByEventTable toTable(SecurityLogByEventRequestDto dto);

    default InetAddress mapStringToInetAddress(String ipAddress) {
        if (ipAddress == null || ipAddress.isBlank()) {
            return null;
        }
        try {
            return InetAddress.getByName(ipAddress);
        } catch (UnknownHostException e) {
            return null;
        }
    }

    default String mapInetAddressToString(InetAddress ipAddress) {
        if (ipAddress == null) {
            return null;
        }
        return ipAddress.getHostAddress();
    }
}
