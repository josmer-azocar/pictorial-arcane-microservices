package com.uneg.pictorialArcane.web.controller;

import com.uneg.pictorialArcane.domain.dto.request.RequestClientAnswerDto;
import com.uneg.pictorialArcane.domain.dto.response.QuestionResponseDto;
import com.uneg.pictorialArcane.domain.service.QuestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/questions")
@Tag(name = "Questions", description = "CRUD Question and additional information / CRUD Pregunta e información adicional")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/getAllQuestions")
    @Operation(
            summary = "Get all questions / Obtener todas las preguntas",
            description = "Retrieve a list of all available questions. / Recupera una lista de todas las preguntas disponibles.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Questions retrieved successfully / Preguntas recuperadas exitosamente"),
                    @ApiResponse(responseCode = "204", description = "No questions found / No se encontraron preguntas")
            }
    )
    public ResponseEntity<List<QuestionResponseDto>> getALl(){
        if(questionService.getAll().isEmpty()){
            return ResponseEntity.noContent().build();
        } else return ResponseEntity.ok(questionService.getAll());
    }

    @PutMapping("/updateQuestion")
    @PreAuthorize("hasRole('CLIENT')")
    @Operation(
            summary = "Update question answer / Actualizar respuesta de pregunta",
            description = "Updates the answer for a specific question for the authenticated client using their token. / Actualiza la respuesta para una pregunta específica para el cliente autenticado usando su token.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Answer updated successfully / Respuesta actualizada exitosamente"),
                    @ApiResponse(responseCode = "400", description = "Invalid input data / Datos de entrada inválidos"),
                    @ApiResponse(responseCode = "404", description = "Question not found / Pregunta no encontrada")
            }
    )
    public ResponseEntity<Void> updateQuestion(@Parameter(description = "New answer / Nueva respuesta", required = true) @Valid @RequestBody @NotBlank String answer,
                                               @Parameter(description = "ID of the question to update / ID de la pregunta a actualizar", required = true) @RequestParam Long questionId,
                                               Authentication authentication){
        String email = authentication.getName();
        questionService.updateQuestion(answer,questionId,email);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/getAssignedQuestions")
    @PreAuthorize("hasRole('CLIENT')")
    @Operation(
            summary = "Get assigned questions / Obtener preguntas asignadas",
            description = "Get the questions assigned to the currently authenticated client. / Obtiene las preguntas asignadas al cliente actualmente autenticado.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Assigned questions retrieved successfully / Preguntas asignadas recuperadas exitosamente")
            }
    )
    public ResponseEntity<List<QuestionResponseDto>> getAssignedQuestions(Authentication authentication){
        String email = authentication.getName();
        return ResponseEntity.ok(this.questionService.getAssignedQuestions(email));
    }

    @PutMapping("/RecoverClientCode")
    @PreAuthorize("hasRole('CLIENT')")
    @Operation(
            summary = "Recover client code / Recuperar código de cliente",
            description = "Recover the client code by providing answers to security questions. / Recuperar el código de cliente proporcionando respuestas a las preguntas de seguridad.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Client code recovery processed / Recuperación de código de cliente procesada"),
                    @ApiResponse(responseCode = "400", description = "Answers are not correct or Invalid input data / Respuestas incorrectas o Datos de entrada inválidos")
            }
    )
    public ResponseEntity<Void> recoverClientCode(@Parameter(description = "List of answers to security questions / Lista de respuestas a preguntas de seguridad",
                                                             example = """
                                                                     [
                                                                         {
                                                                             "idQuestion": 1,
                                                                             "Answer": "My Answer"
                                                                         }
                                                                     ]""")
                                                      @RequestBody @Valid List<RequestClientAnswerDto> clientAnswerDtos,
                                                  Authentication authentication){
        String email = authentication.getName();
        this.questionService.recoverClientCode(email, clientAnswerDtos);
        return ResponseEntity.ok().build();
    }

}
