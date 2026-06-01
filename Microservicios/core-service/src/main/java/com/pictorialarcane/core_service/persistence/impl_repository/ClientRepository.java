package com.pictorialarcane.core_service.persistence.impl_repository;

import com.pictorialarcane.core_service.domain.dto.response.ClientResponseDto;
import com.pictorialarcane.core_service.domain.dto.update.UpdateClientDto;
import com.pictorialarcane.core_service.domain.exception.ClientDoesNotExistsException;
import com.pictorialarcane.core_service.domain.exception.UserDoesNotExistsException;
import com.pictorialarcane.core_service.persistence.crud_repository.CrudClientRepository;
import com.pictorialarcane.core_service.persistence.crud_repository.CrudUserRepository;
import com.pictorialarcane.core_service.persistence.entity.ClientEntity;
import com.pictorialarcane.core_service.persistence.entity.UserEntity;
import com.pictorialarcane.core_service.persistence.mapper.ClientMappper;
import org.springframework.stereotype.Repository;

@Repository
public class ClientRepository {

    private final ClientMappper clientMappper;
    private final CrudClientRepository crudClientRepository;
    private final CrudUserRepository crudUserRepository;

    public ClientRepository(ClientMappper clientMappper, CrudClientRepository crudClientRepository, CrudUserRepository crudUserRepository) {
        this.clientMappper = clientMappper;
        this.crudClientRepository = crudClientRepository;
        this.crudUserRepository = crudUserRepository;
    }

    public ClientResponseDto updateClient(UpdateClientDto updateClientDto, String email) {
        if (crudUserRepository.findFirstByEmail(email) == null) throw new UserDoesNotExistsException(email);

        UserEntity user = crudUserRepository.findFirstByEmail(email);
        Long clientDni = user.getDniUser();

        ClientEntity client = crudClientRepository.findFirstByDniUser(clientDni);

        clientMappper.updateEntityFromDto(updateClientDto, client);

        return clientMappper.toResponseDto(crudClientRepository.save(client));
    }

   public ClientResponseDto getClientByEmail(String email){
        return this.clientMappper.toResponseDto(this.crudClientRepository.findByUser_Email(email));
    }

    public ClientResponseDto getClientByDni(Long dniUser) {
        ClientEntity clientEntity = this.crudClientRepository.findFirstByDniUser(dniUser);
        if (clientEntity == null) {
            throw new ClientDoesNotExistsException(dniUser);
        }
        return this.clientMappper.toResponseDto(clientEntity);
    }

    public void assignClientCode(ClientResponseDto clientDto, String code){
        ClientEntity clientEntity = this.crudClientRepository.findFirstByDniUser(clientDto.dniUser());
        clientEntity.setSecurityCode(code);
        this.crudClientRepository.save(clientEntity);
    }
}
