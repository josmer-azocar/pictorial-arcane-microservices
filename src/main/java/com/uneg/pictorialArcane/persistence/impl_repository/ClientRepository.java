package com.uneg.pictorialArcane.persistence.impl_repository;

import com.uneg.pictorialArcane.domain.dto.response.ClientResponseDto;
import com.uneg.pictorialArcane.domain.dto.update.UpdateClientDto;
import com.uneg.pictorialArcane.domain.exception.UserDoesNotExistsException;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudClientRepository;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudUserRepository;
import com.uneg.pictorialArcane.persistence.entity.ClientEntity;
import com.uneg.pictorialArcane.persistence.entity.UserEntity;
import com.uneg.pictorialArcane.persistence.mapper.ClientMappper;
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

    public ClientResponseDto updateClient(UpdateClientDto updateClientDto, String username) {
        if (crudUserRepository.findFirstByEmail(username) == null) throw new UserDoesNotExistsException(username);

        UserEntity user = crudUserRepository.findFirstByEmail(username);
        Long clientDni = user.getDniUser();

        ClientEntity client = crudClientRepository.findFirstByDniUser(clientDni);

        clientMappper.updateEntityFromDto(updateClientDto, client);

        return clientMappper.toResponseDto(crudClientRepository.save(client));
    }

   public ClientResponseDto getClientByEmail(String email){
        return this.clientMappper.toResponseDto(this.crudClientRepository.findByUser_Email(email));
    }

    public void assignClientCode(ClientResponseDto clientDto, String code){
        ClientEntity clientEntity = this.crudClientRepository.findFirstByDniUser(clientDto.dniUser());
        clientEntity.setSecurityCode(code);
        this.crudClientRepository.save(clientEntity);
    }
}
