package com.uneg.pictorialArcane.persistence.impl_repository;

import com.uneg.pictorialArcane.domain.dto.request.RequestClientAnswerDto;
import com.uneg.pictorialArcane.domain.dto.response.QuestionResponseDto;
import com.uneg.pictorialArcane.domain.exception.AnswersAreNotCorrectException;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudClientAnswerRepository;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudClientRepository;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudQuestionRepository;
import com.uneg.pictorialArcane.persistence.entity.ClientAnswerEntity;
import com.uneg.pictorialArcane.persistence.entity.ClientEntity;
import com.uneg.pictorialArcane.persistence.entity.QuestionEntity;
import com.uneg.pictorialArcane.persistence.mapper.QuestionMapper;
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
        QuestionEntity question = crudQuestionRepository.findByIdQuestion(questionId);

    if(crudClientAnswerRepository.findByClient_User_EmailAndQuestion_IdQuestion(email,questionId) == null){

        ClientAnswerEntity clientAnswerEntity = new ClientAnswerEntity();
        clientAnswerEntity.setClient(client);
        clientAnswerEntity.setQuestion(question);
        clientAnswerEntity.setAnswer(answer.toLowerCase());

        this.crudClientAnswerRepository.save(clientAnswerEntity);

    }else{
        ClientAnswerEntity clientAnswerEntity = crudClientAnswerRepository
                .findByClient_User_EmailAndQuestion_IdQuestion(email,questionId);
        clientAnswerEntity.setAnswer(answer.toLowerCase());
        this.crudClientAnswerRepository.save(clientAnswerEntity);
    }
    }

    public List<QuestionResponseDto> getAssignedQuestions(String email) {
        return this.questionMapper.toResponseDto(
                this.crudQuestionRepository.findQuestionEntitiesByClientAnswers_Client_User_email(email)
        );
    }

    public Boolean verifyAnswers(List<RequestClientAnswerDto> clientAnswerDtos, String email){
        List<ClientAnswerEntity> clientAnswerEntities = new ArrayList<>();
        for(RequestClientAnswerDto clientAnswerDto: clientAnswerDtos){
            if(clientAnswerDto != null) {
                clientAnswerEntities.add(this.crudClientAnswerRepository.findByClient_User_EmailAndQuestion_IdQuestion(
                        email, clientAnswerDto.idQuestion())
                );
            }
        }

        for(ClientAnswerEntity clientAnswer: clientAnswerEntities){
           for(RequestClientAnswerDto answerDto: clientAnswerDtos){
               if(answerDto != null && clientAnswer != null && clientAnswer.getQuestion().getIdQuestion().equals(answerDto.idQuestion())){

                   if(!this.passwordEncoder.matches(answerDto.Answer().toLowerCase(), clientAnswer.getAnswer())){
                       throw new AnswersAreNotCorrectException();
                   }

               }
           }
        }
        return true;
    }
}
