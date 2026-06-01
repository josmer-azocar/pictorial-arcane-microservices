package com.pictorialarcane.core_service.persistence.crud_repository;

import com.pictorialarcane.core_service.persistence.entity.ClientAnswerEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface CrudClientAnswerRepository extends CrudRepository<ClientAnswerEntity, Long> {
    ClientAnswerEntity findByClient_User_EmailAndQuestion_IdQuestion(
            String email, Long idQuestion
    );

    List<ClientAnswerEntity> findALlClientAnswerEntitiesByClient_User_Email(String email);
}
