package com.pictorial.audit_service.dto.request;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Verifica que changedBy acepte el valor 0 (actor "sistema" usado por core-service en las
 * liberaciones automáticas de reservas) y siga rechazando nulos y negativos.
 */
class ArtworkStatusHistoryRequestDtoTest {

    private static ValidatorFactory factory;
    private static Validator validator;

    @BeforeAll
    static void setUp() {
        factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @AfterAll
    static void tearDown() {
        factory.close();
    }

    private ArtworkStatusHistoryRequestDto dtoConChangedBy(Long changedBy) {
        return new ArtworkStatusHistoryRequestDto(
                42L, "La noche estrellada", changedBy, "AVAILABLE", "RESERVED", "Reserva liberada");
    }

    @Test
    void changedByCeroActorSistemaEsValido() {
        Set<ConstraintViolation<ArtworkStatusHistoryRequestDto>> violations =
                validator.validate(dtoConChangedBy(0L));
        assertTrue(violations.isEmpty(),
                "changedBy=0 (actor sistema) debe pasar la validación, pero hubo: " + violations);
    }

    @Test
    void changedByPositivoEsValido() {
        Set<ConstraintViolation<ArtworkStatusHistoryRequestDto>> violations =
                validator.validate(dtoConChangedBy(20000002L));
        assertTrue(violations.isEmpty(),
                "changedBy positivo debe pasar la validación, pero hubo: " + violations);
    }

    @Test
    void changedByNegativoEsInvalido() {
        Set<ConstraintViolation<ArtworkStatusHistoryRequestDto>> violations =
                validator.validate(dtoConChangedBy(-1L));
        assertEquals(1, violations.size());
        assertEquals("changedBy", violations.iterator().next().getPropertyPath().toString());
    }

    @Test
    void changedByNuloEsInvalido() {
        Set<ConstraintViolation<ArtworkStatusHistoryRequestDto>> violations =
                validator.validate(dtoConChangedBy(null));
        assertEquals(1, violations.size());
        assertEquals("changedBy", violations.iterator().next().getPropertyPath().toString());
    }
}
