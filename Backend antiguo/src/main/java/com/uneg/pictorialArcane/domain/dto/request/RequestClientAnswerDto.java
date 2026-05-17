package com.uneg.pictorialArcane.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RequestClientAnswerDto(
        @NotNull(message = "must have id question")
        Long idQuestion,
        @NotBlank(message = "the answer is necessary")
        String Answer
) {
}
