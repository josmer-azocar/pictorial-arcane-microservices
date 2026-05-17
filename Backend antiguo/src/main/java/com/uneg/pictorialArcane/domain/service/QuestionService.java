package com.uneg.pictorialArcane.domain.service;

import com.uneg.pictorialArcane.domain.dto.request.RequestClientAnswerDto;
import com.uneg.pictorialArcane.domain.dto.response.ClientResponseDto;
import com.uneg.pictorialArcane.domain.dto.response.QuestionResponseDto;
import com.uneg.pictorialArcane.domain.exception.QuestionDoesNotExistsException;
import com.uneg.pictorialArcane.domain.exception.UserDoesNotExistsException;
import com.uneg.pictorialArcane.domain.tools.SecurityCodeGenerator;
import com.uneg.pictorialArcane.persistence.entity.ClientEntity;
import com.uneg.pictorialArcane.persistence.impl_repository.ClientRepository;
import com.uneg.pictorialArcane.persistence.impl_repository.QuestionRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public QuestionService(QuestionRepository questionRepository, ClientRepository clientRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.questionRepository = questionRepository;
        this.clientRepository = clientRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public List<QuestionResponseDto> getAll() {
        return questionRepository.getAll();
    }

    public void updateQuestion(String answer, Long questionId, String email) {
        if(this.questionRepository.getById(questionId) == null) {
            throw new QuestionDoesNotExistsException(questionId);
        }
        questionRepository.updateQuestion(answer, questionId, email);
    }

    public List<QuestionResponseDto> getAssignedQuestions(String email) {
        return this.questionRepository.getAssignedQuestions(email);
    }

    public void recoverClientCode(String email, List<RequestClientAnswerDto> clientAnswerDtos) {

        if(this.questionRepository.verifyAnswers(clientAnswerDtos,email)){
            String code = SecurityCodeGenerator.generateNumericPin(6);

            this.clientRepository.assignClientCode(
                    clientRepository.getClientByEmail(email),
                    passwordEncoder.encode(code)
            );

            emailService.sendSimpleEmail( email,
                    "CODIGO DE SEGURIDAD DE PICTORIAL ARCANE",
                    "Tu nuevo codigo de seguridad es el Siguiente: " + code);
        }
    }
}
