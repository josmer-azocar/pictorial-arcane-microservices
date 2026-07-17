package com.pictorial.audit_service.web.controller;

import com.pictorial.audit_service.dto.request.ArtworkStatusHistoryRequestDto;
import com.pictorial.audit_service.dto.response.ArtworkStatusHistoryResponseDto;
import com.pictorial.audit_service.dto.request.BillingByMonthRequestDto;
import com.pictorial.audit_service.dto.response.BillingByMonthResponseDto;
import com.pictorial.audit_service.dto.request.SecurityLogByEventRequestDto;
import com.pictorial.audit_service.dto.response.SecurityLogByEventResponseDto;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class AuditControllersIntegrationTest {

    @Autowired
    private SecurityLogByEventController securityLogController;

    @Autowired
    private BillingByMonthController billingController;

    @Autowired
    private ArtworkStatusHistoryController historyController;

    @BeforeEach
    void setUp() {
        // Set ROLE_ADMIN context for any protected GET methods
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("admin", null, List.of(new SimpleGrantedAuthority("ROLE_ADMIN")))
        );
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void testSecurityLogFlow() {
        String details = "AuditControllersIntegrationTest security log at " + java.time.Instant.now();
        SecurityLogByEventRequestDto dto = new SecurityLogByEventRequestDto(
                "INTEGRATION_TEST_EVENT",
                12345678L,
                87654321L,
                details,
                "127.0.0.1",
                "session-test"
        );

        // Create log
        ResponseEntity<SecurityLogByEventResponseDto> createResponse = securityLogController.create(dto);
        assertNotNull(createResponse.getBody());
        assertEquals(details, createResponse.getBody().details());

        // Retrieve all and verify
        ResponseEntity<List<SecurityLogByEventResponseDto>> allResponse = securityLogController.getAll();
        assertNotNull(allResponse.getBody());
        boolean found = allResponse.getBody().stream().anyMatch(log -> details.equals(log.details()));
        assertTrue(found, "The security log should be stored and returned in the list");
    }

    @Test
    void testBillingByMonthFlow() {
        String description = "AuditControllersIntegrationTest billing description at " + java.time.Instant.now();
        long saleId = (long) (Math.random() * 1000000) + 9000000;
        BillingByMonthRequestDto dto = new BillingByMonthRequestDto(
                saleId,
                LocalDate.now(),
                12345678L,
                999L,
                87654321L,
                description,
                15.0,
                10.0,
                150.0,
                "APPROVED",
                "Test Address",
                "SHIPPED",
                15.0,
                165.0
        );

        // Create billing record
        ResponseEntity<BillingByMonthResponseDto> createResponse = billingController.create(dto);
        assertNotNull(createResponse.getBody());
        assertEquals(description, createResponse.getBody().description());
        assertEquals(saleId, createResponse.getBody().saleId());

        // Retrieve all and verify
        ResponseEntity<List<BillingByMonthResponseDto>> allResponse = billingController.getAll();
        assertNotNull(allResponse.getBody());
        boolean found = allResponse.getBody().stream().anyMatch(bill -> description.equals(bill.description()));
        assertTrue(found, "The billing record should be stored and returned in the list");
    }

    @Test
    void testArtworkStatusHistoryFlow() {
        String reason = "AuditControllersIntegrationTest status change reason at " + java.time.Instant.now();
        ArtworkStatusHistoryRequestDto dto = new ArtworkStatusHistoryRequestDto(
                999L,
                "La noche estrellada",
                12345678L,
                "AVAILABLE",
                "RESERVED",
                reason
        );

        // Create status change history
        ResponseEntity<ArtworkStatusHistoryResponseDto> createResponse = historyController.create(dto);
        assertNotNull(createResponse.getBody());
        assertEquals(reason, createResponse.getBody().reason());

        // Retrieve all and verify
        ResponseEntity<List<ArtworkStatusHistoryResponseDto>> allResponse = historyController.getAll();
        assertNotNull(allResponse.getBody());
        boolean found = allResponse.getBody().stream().anyMatch(hist -> reason.equals(hist.reason()));
        assertTrue(found, "The artwork status history record should be stored and returned in the list");
    }
}
