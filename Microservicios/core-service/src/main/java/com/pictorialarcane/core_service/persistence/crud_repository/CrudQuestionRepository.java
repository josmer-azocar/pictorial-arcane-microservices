package com.pictorialarcane.core_service.persistence.crud_repository;

import com.pictorialarcane.core_service.persistence.entity.QuestionEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface CrudQuestionRepository extends CrudRepository<QuestionEntity, Long> {

    QuestionEntity findByIdQuestion(Long idQuestion);
    List<QuestionEntity> findQuestionEntitiesByClientAnswers_Client_User_email(String email);

}
