package com.uneg.pictorialArcane.web.controller;

import com.uneg.pictorialArcane.domain.dto.request.RequestClientAnswerDto;
import com.uneg.pictorialArcane.domain.dto.response.ClientResponseDto;
import com.uneg.pictorialArcane.domain.dto.response.QuestionResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateClientDto;
import com.uneg.pictorialArcane.domain.service.QuestionService;
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
@Tag(name = "Questions", description = "CRUD Question and additional information")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping("/getAllQuestions")
    public ResponseEntity<List<QuestionResponseDto>> getALl(){
        if(questionService.getAll().isEmpty()){
            return ResponseEntity.noContent().build();
        } else return ResponseEntity.ok(questionService.getAll());
    }

    @PutMapping("/updateQuestion")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Void> updateQuestion(@Valid @RequestBody @NotBlank String answer, @RequestParam Long questionId,
                                               Authentication authentication){
        String email = authentication.getName();
        questionService.updateQuestion(answer,questionId,email);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/getAssignedQuestions")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<QuestionResponseDto>> getAssignedQuestions(Authentication authentication){
        String email = authentication.getName();
        return ResponseEntity.ok(this.questionService.getAssignedQuestions(email));
    }

    @PutMapping("/RecoverClientCode")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Void> recoverClientCode(@RequestBody @Valid List<RequestClientAnswerDto> clientAnswerDtos,
                                                  Authentication authentication){
        String email = authentication.getName();
        this.questionService.recoverClientCode(email, clientAnswerDtos);
        return ResponseEntity.ok().build();
    }

}
