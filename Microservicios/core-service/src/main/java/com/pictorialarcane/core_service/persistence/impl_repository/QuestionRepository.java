package com.pictorialarcane.core_service.persistence.impl_repository;

import com.pictorialarcane.core_service.domain.dto.request.RequestClientAnswerDto;
import com.pictorialarcane.core_service.domain.dto.response.QuestionResponseDto;
import com.pictorialarcane.core_service.domain.exception.AnswersAreNotCorrectException;
import com.pictorialarcane.core_service.domain.exception.UserDoesNotExistsException;
import com.pictorialarcane.core_service.persistence.crud_repository.CrudClientAnswerRepository;
import com.pictorialarcane.core_service.persistence.crud_repository.CrudClientRepository;
import com.pictorialarcane.core_service.persistence.crud_repository.CrudQuestionRepository;
import com.pictorialarcane.core_service.persistence.entity.ClientAnswerEntity;
import com.pictorialarcane.core_service.persistence.entity.ClientEntity;
import com.pictorialarcane.core_service.persistence.entity.QuestionEntity;
import com.pictorialarcane.core_service.persistence.mapper.QuestionMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class QuestionRepository {
    private final CrudQuestionRepository crudQuestionRepository;
    private final QuestionMapper questionMapper;
    private final PasswordEncoder passwordEncoder;
    private final CrudClientRepository crudClientRepository;
    private final CrudClientAnswerRepository crudClientAnswerRepository;

    public QuestionRepository(CrudQuestionRepository crudQuestionRepository, QuestionMapper questionMapper, PasswordEncoder passwordEncoder, CrudClientRepository crudClientRepository, CrudClientAnswerRepository crudClientAnswerRepository) {
        this.crudQuestionRepository = crudQuestionRepository;
        this.questionMapper = questionMapper;
        this.passwordEncoder = passwordEncoder;
        this.crudClientRepository = crudClientRepository;
        this.crudClientAnswerRepository = crudClientAnswerRepository;
    }

    public List<QuestionResponseDto> getAll() {
            return this.questionMapper.toResponseDto(crudQuestionRepository.findAll());
    }

    public QuestionResponseDto getById(Long questionId){
        return this.questionMapper.toResponseDto(crudQuestionRepository.findByIdQuestion(questionId));
    }

    public void updateQuestion(String answer, Long questionId, String email) {
        ClientEntity client = crudClientRepository.findByUser_Email(email);
        if (client == null) {
            throw new UserDoesNotExistsException(email);
        }
        QuestionEntity question = crudQuestionRepository.findByIdQuestion(questionId);

    if(crudClientAnswerRepository.findByClient_User_EmailAndQuestion_IdQuestion(email,questionId) == null){

        ClientAnswerEntity clientAnswerEntity = new ClientAnswerEntity();
        clientAnswerEntity.setClient(client);
        clientAnswerEntity.setQuestion(question);
        clientAnswerEntity.setAnswer(passwordEncoder.encode(answer.toLowerCase()));

        this.crudClientAnswerRepository.save(clientAnswerEntity);

    }else{
        ClientAnswerEntity clientAnswerEntity = crudClientAnswerRepository
                .findByClient_User_EmailAndQuestion_IdQuestion(email,questionId);
        clientAnswerEntity.setAnswer(passwordEncoder.encode(answer.toLowerCase()));
        this.crudClientAnswerRepository.save(clientAnswerEntity);
    }
    }

    public List<QuestionResponseDto> getAssignedQuestions(String email) {
        return this.questionMapper.toResponseDto(
                this.crudQuestionRepository.findQuestionEntitiesByClientAnswers_Client_User_email(email)
        );
    }

    public Boolean verifyAnswers(List<RequestClientAnswerDto> clientAnswerDtos, String email){
        List<ClientAnswerEntity> configuredAnswers = this.crudClientAnswerRepository.findALlClientAnswerEntitiesByClient_User_Email(email);
        if (configuredAnswers == null || configuredAnswers.isEmpty()) {
            throw new AnswersAreNotCorrectException();
        }

        if (clientAnswerDtos == null || clientAnswerDtos.size() < configuredAnswers.size()) {
            throw new AnswersAreNotCorrectException();
        }

        for (ClientAnswerEntity clientAnswer : configuredAnswers) {
            RequestClientAnswerDto matchingDto = clientAnswerDtos.stream()
                    .filter(dto -> dto != null && dto.idQuestion().equals(clientAnswer.getQuestion().getIdQuestion()))
                    .findFirst()
                    .orElseThrow(() -> new AnswersAreNotCorrectException());

            if (!this.passwordEncoder.matches(matchingDto.Answer().toLowerCase(), clientAnswer.getAnswer())) {
                throw new AnswersAreNotCorrectException();
            }
        }
        return true;
    }
}
