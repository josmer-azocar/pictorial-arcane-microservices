package com.pictorialarcane.core_service.persistence.impl_repository;

import com.pictorialarcane.core_service.client.ArtworkClient;
import com.pictorialarcane.core_service.client.AuditClient;
import com.pictorialarcane.core_service.client.RecommendationClient;
import com.pictorialarcane.core_service.client.dto.BillingByMonthRequest;
import com.pictorialarcane.core_service.domain.Enum.SaleStatus;
import com.pictorialarcane.core_service.domain.Enum.ShippingStatus;
import com.pictorialarcane.core_service.domain.dto.request.PaymentRequestDto;
import com.pictorialarcane.core_service.domain.exception.SaleDoesNotExistsException;
import com.pictorialarcane.core_service.persistence.crud_repository.CrudPaymentRepository;
import com.pictorialarcane.core_service.persistence.crud_repository.CrudSaleRepositoy;
import com.pictorialarcane.core_service.persistence.crud_repository.CrudUserRepository;
import com.pictorialarcane.core_service.persistence.entity.ClientEntity;
import com.pictorialarcane.core_service.persistence.entity.PaymentEntity;
import com.pictorialarcane.core_service.persistence.entity.SaleEntity;
import com.pictorialarcane.core_service.persistence.entity.UserEntity;
import com.pictorialarcane.core_service.persistence.mapper.PaymentMapper;
import com.pictorialarcane.core_service.persistence.mapper.SaleMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class SaleRepositoryTest {

    @Mock
    private CrudSaleRepositoy crudSaleRepository;
    @Mock
    private CrudUserRepository crudUserRepository;
    @Mock
    private SaleMapper saleMapper;
    @Mock
    private PaymentMapper paymentMapper;
    @Mock
    private CrudPaymentRepository crudPaymentRepository;
    @Mock
    private AuditClient auditClient;
    @Mock
    private ArtworkClient artworkClient;
    @Mock
    private RecommendationClient recommendationClient;

    @InjectMocks
    private SaleRepository saleRepository;

    // ------------------------------------------------------------------
    // Venta inexistente: debe lanzar SaleDoesNotExistsException (404) en
    // lugar de NullPointerException (500), sin efectos colaterales.
    // ------------------------------------------------------------------

    @Test
    public void rejectPendingSaleConVentaInexistenteLanzaSaleDoesNotExists() {
        when(crudSaleRepository.findByIdSale(99L)).thenReturn(null);

        assertThrows(SaleDoesNotExistsException.class,
                () -> saleRepository.rejectPendingSale(99L, 20000001L));

        verify(crudSaleRepository, never()).save(any());
        verify(artworkClient, never()).release(any(), any());
    }

    @Test
    public void confirmSaleConVentaInexistenteLanzaSaleDoesNotExists() {
        when(crudSaleRepository.findByIdSale(99L)).thenReturn(null);

        assertThrows(SaleDoesNotExistsException.class,
                () -> saleRepository.confirmSale(99L, "admin@mail.com", null, "desc", "direccion"));

        verify(crudPaymentRepository, never()).save(any());
        verify(auditClient, never()).registerBilling(any());
        verify(artworkClient, never()).markSold(any(), any());
        verify(recommendationClient, never()).syncPurchase(any());
    }

    // ------------------------------------------------------------------
    // Flujos normales: la validación nueva no debe romper el camino feliz.
    // ------------------------------------------------------------------

    @Test
    public void rejectPendingSaleConVentaPendienteLaCancelaYLiberaLaObra() {
        SaleEntity sale = new SaleEntity();
        sale.setIdSale(5L);
        sale.setIdArtwork(42L);
        sale.setSaleStatus(SaleStatus.PENDING.name());
        sale.setShippingStatus(ShippingStatus.PENDING.name());
        when(crudSaleRepository.findByIdSale(5L)).thenReturn(sale);

        saleRepository.rejectPendingSale(5L, 20000001L);

        assertEquals(SaleStatus.CANCELED.name(), sale.getSaleStatus());
        assertEquals(ShippingStatus.CANCELED.name(), sale.getShippingStatus());
        verify(crudSaleRepository).save(sale);
        verify(artworkClient).release(42L, 20000001L);
    }

    @Test
    public void confirmSaleConVentaPendienteLaApruebaYNotificaConElDniDelAdmin() {
        ClientEntity client = new ClientEntity();
        client.setDniUser(20000002L);

        SaleEntity sale = new SaleEntity();
        sale.setIdSale(5L);
        sale.setIdArtwork(42L);
        sale.setClient(client);
        sale.setSaleStatus(SaleStatus.PENDING.name());
        sale.setShippingStatus(ShippingStatus.PENDING.name());
        sale.setPrice(1000.0);
        sale.setProfitPercentage(0.08);
        sale.setProfitAmount(80.0);
        sale.setTaxAmount(160.0);
        sale.setTotalPaid(1160.0);

        UserEntity admin = new UserEntity();
        admin.setDniUser(10000001L);

        PaymentRequestDto paymentDto =
                new PaymentRequestDto(1160.0, LocalDate.now(), "Banco de Prueba", "REF-001");

        when(crudSaleRepository.findByIdSale(5L)).thenReturn(sale);
        when(crudUserRepository.findFirstByEmail("admin@mail.com")).thenReturn(admin);
        when(paymentMapper.toEntity(paymentDto)).thenReturn(new PaymentEntity());
        when(crudSaleRepository.save(sale)).thenReturn(sale);

        saleRepository.confirmSale(5L, "admin@mail.com", paymentDto, "desc", "direccion");

        assertEquals(SaleStatus.APPROVED.name(), sale.getSaleStatus());
        verify(crudPaymentRepository).save(any(PaymentEntity.class));
        verify(artworkClient).markSold(42L, 10000001L);
        verify(recommendationClient).syncPurchase(any());

        ArgumentCaptor<BillingByMonthRequest> billing = ArgumentCaptor.forClass(BillingByMonthRequest.class);
        verify(auditClient).registerBilling(billing.capture());
        assertEquals(10000001L, billing.getValue().adminDni());
        assertEquals(20000002L, billing.getValue().clientDni());
        assertEquals(42L, billing.getValue().artworkId());
    }
}
