package com.pictorialarcane.core_service.domain.service;

import com.pictorialarcane.core_service.client.ArtworkClient;
import com.pictorialarcane.core_service.client.AuditClient;
import com.pictorialarcane.core_service.client.RecommendationClient;
import com.pictorialarcane.core_service.persistence.crud_repository.CrudClientRepository;
import com.pictorialarcane.core_service.persistence.crud_repository.CrudUserRepository;
import com.pictorialarcane.core_service.persistence.entity.ClientEntity;
import com.pictorialarcane.core_service.persistence.entity.UserEntity;
import com.pictorialarcane.core_service.persistence.impl_repository.SaleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SaleServiceTest {

    @Mock
    private CrudUserRepository crudUserRepository;
    @Mock
    private CrudClientRepository crudClientRepository;
    @Mock
    private SaleRepository saleRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private MembershipService membershipService;
    @Mock
    private ArtworkClient artworkClient;
    @Mock
    private AuditClient auditClient;
    @Mock
    private RecommendationClient recommendationClient;

    @InjectMocks
    private SaleService saleService;

    @Test
    public void testReserveArtworkSuccess() {
        String email = "client@mail.com";
        Long artworkId = 1L;
        Double price = 1000.0;
        Double commissionRate = 0.08;
        String securityCode = "123456";

        UserEntity user = new UserEntity();
        user.setDniUser(20000002L);
        user.setEmail(email);

        ClientEntity client = new ClientEntity();
        client.setDniUser(20000002L);
        client.setSecurityCode("encoded_security_code");

        when(crudUserRepository.findFirstByEmail(email)).thenReturn(user);
        when(crudClientRepository.findFirstByDniUser(20000002L)).thenReturn(client);
        when(passwordEncoder.matches(securityCode, "encoded_security_code")).thenReturn(true);
        when(artworkClient.reserve(artworkId, 20000002L)).thenReturn("La noche estrellada");

        saleService.reserveArtWork(artworkId, price, commissionRate, securityCode, email);

        verify(membershipService).getActiveMembership(email);
        verify(artworkClient).reserve(artworkId, 20000002L);
        verify(saleRepository).createReservedSale(artworkId, "La noche estrellada", price, commissionRate, client);
    }
}
