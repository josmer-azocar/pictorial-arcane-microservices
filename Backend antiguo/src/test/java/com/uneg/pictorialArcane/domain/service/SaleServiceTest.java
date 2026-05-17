package com.uneg.pictorialArcane.domain.service;

import com.uneg.pictorialArcane.domain.exception.ArtWorkNotAvailableException;
import com.uneg.pictorialArcane.domain.exception.InvalidSecurityCodeException;
import com.uneg.pictorialArcane.domain.exception.UserDoesNotExistsException;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudClientRepository;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudUserRepository;
import com.uneg.pictorialArcane.persistence.entity.ArtWorkEntity;
import com.uneg.pictorialArcane.persistence.entity.ClientEntity;
import com.uneg.pictorialArcane.persistence.entity.UserEntity;
import com.uneg.pictorialArcane.persistence.impl_repository.ArtWorkRespository;
import com.uneg.pictorialArcane.persistence.impl_repository.SaleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SaleServiceTest {

    @Mock
    private ArtWorkRespository artWorkRespository;
    @Mock
    private CrudUserRepository crudUserRepository;
    @Mock
    private CrudClientRepository crudClientRepository;
    @Mock
    private SaleRepository saleRepository;
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private SaleService saleService;

    private UserEntity user;
    private ClientEntity client;
    private ArtWorkEntity artWork;

    @BeforeEach
    void setUp() {
        user = new UserEntity();
        user.setEmail("client@example.com");
        user.setDniUser(123L);

        client = new ClientEntity();
        client.setDniUser(123L);
        client.setSecurityCode("encoded-code");

        artWork = new ArtWorkEntity();
        artWork.setIdArtWork(1L);
        artWork.setStatus("AVAILABLE");
    }

    @Test
    void reserveArtWork_success_persistsSaleAndReservesArtWork() {
        when(crudUserRepository.findFirstByEmail("client@example.com")).thenReturn(user);
        when(crudClientRepository.findFirstByDniUser(123L)).thenReturn(client);
        when(passwordEncoder.matches("1234", "encoded-code")).thenReturn(true);
        when(artWorkRespository.getArtWorkEntityById(1L)).thenReturn(artWork);

        saleService.reserveArtWork(1L, "1234", "client@example.com");

        verify(saleRepository).createReservedSale(artWork, client);
        verify(artWorkRespository).saveEntity(artWork);
    }

    @Test
    void reserveArtWork_userNotFound_throwsUserDoesNotExistsException() {
        when(crudUserRepository.findFirstByEmail("missing@example.com")).thenReturn(null);

        assertThrows(UserDoesNotExistsException.class,
                () -> saleService.reserveArtWork(1L, "1234", "missing@example.com"));

        verifyNoInteractions(crudClientRepository, saleRepository, artWorkRespository);
    }

    @Test
    void reserveArtWork_clientNotFound_throwsUserDoesNotExistsException() {
        when(crudUserRepository.findFirstByEmail("client@example.com")).thenReturn(user);
        when(crudClientRepository.findFirstByDniUser(123L)).thenReturn(null);

        assertThrows(UserDoesNotExistsException.class,
                () -> saleService.reserveArtWork(1L, "1234", "client@example.com"));

        verify(crudClientRepository).findFirstByDniUser(123L);
        verifyNoInteractions(saleRepository, artWorkRespository);
    }

    @Test
    void reserveArtWork_invalidSecurityCode_throwsInvalidSecurityCodeException() {
        when(crudUserRepository.findFirstByEmail("client@example.com")).thenReturn(user);
        when(crudClientRepository.findFirstByDniUser(123L)).thenReturn(client);
        when(passwordEncoder.matches("wrong", "encoded-code")).thenReturn(false);

        assertThrows(InvalidSecurityCodeException.class,
                () -> saleService.reserveArtWork(1L, "wrong", "client@example.com"));

        verifyNoInteractions(saleRepository, artWorkRespository);
    }

    @Test
    void reserveArtWork_artWorkNotAvailable_throwsArtWorkNotAvailableException() {
        artWork.setStatus("RESERVED");

        when(crudUserRepository.findFirstByEmail("client@example.com")).thenReturn(user);
        when(crudClientRepository.findFirstByDniUser(123L)).thenReturn(client);
        when(passwordEncoder.matches("1234", "encoded-code")).thenReturn(true);
        when(artWorkRespository.getArtWorkEntityById(1L)).thenReturn(artWork);

        assertThrows(ArtWorkNotAvailableException.class,
                () -> saleService.reserveArtWork(1L, "1234", "client@example.com"));

        verify(saleRepository, never()).createReservedSale(any(), any());
        verify(artWorkRespository, never()).saveEntity(any());
    }
}

