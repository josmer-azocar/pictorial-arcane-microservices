package com.pictorialarcane.core_service.domain.service;

import com.pictorialarcane.core_service.domain.Enum.ShippingStatus;
import com.pictorialarcane.core_service.domain.dto.request.PaymentRequestDto;
import com.pictorialarcane.core_service.domain.dto.response.BillingSummaryResponseDto;
import com.pictorialarcane.core_service.domain.dto.response.SaleResponseDto;
import com.pictorialarcane.core_service.domain.dto.response.UserProfileResponseDto;
import com.pictorialarcane.core_service.domain.dto.response.UserResponseDto;
import com.pictorialarcane.core_service.domain.exception.SaleDoesNotExistsException;
import com.pictorialarcane.core_service.domain.exception.UserDoesNotExistsException;
import com.pictorialarcane.core_service.persistence.impl_repository.ClientRepository;
import com.pictorialarcane.core_service.persistence.impl_repository.SaleRepository;
import com.pictorialarcane.core_service.persistence.impl_repository.UserEntityRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AdministrationService {
    private final SaleRepository saleRepository;
    private final UserEntityRepository userEntityRepository;
    private final ClientRepository clientRepository;

    public AdministrationService(SaleRepository saleRepository, UserEntityRepository userEntityRepository, ClientRepository clientRepository) {
        this.saleRepository = saleRepository;
        this.userEntityRepository = userEntityRepository;
        this.clientRepository = clientRepository;
    }

    public List<SaleResponseDto> getAllPendingSales() {
        return saleRepository.getAllPendingSales();
    }

    public void rejectPendingSale(Long saleId, String email) {
        if(saleRepository.getSaleById(saleId) == null){
            throw new SaleDoesNotExistsException(saleId);
        }

        UserResponseDto admin = this.userEntityRepository.getByEmail(email);
        if (admin == null) {
            throw new UserDoesNotExistsException(email);
        }
        this.saleRepository.rejectPendingSale(saleId, admin.dniUser());
    }

    public SaleResponseDto confirmSale(Long saleId, String email, PaymentRequestDto paymentRequestDto, String description, String direction) {
        if (saleRepository.getSaleById(saleId) == null) throw new SaleDoesNotExistsException(saleId);
        if (userEntityRepository.getByEmail(email) == null) throw new UserDoesNotExistsException(email);

        return saleRepository.confirmSale(saleId, email, paymentRequestDto, description, direction);
    }

    public SaleResponseDto updateShippingStatus(Long saleId, ShippingStatus shippingStatus) {
        if (saleRepository.getSaleById(saleId) == null) throw new SaleDoesNotExistsException(saleId);
        if (shippingStatus != ShippingStatus.CANCELED && shippingStatus != ShippingStatus.SHIPPED) throw new RuntimeException("The new shipping status must be SHIPPED or CANCELED to be updated");

        return saleRepository.updateShippingStatus(saleId, shippingStatus);
    }

    public UserProfileResponseDto getClientProfileByDni(Long dniUser) {
        UserResponseDto user = this.userEntityRepository.getByIdUser(dniUser);
        return new UserProfileResponseDto(user, this.clientRepository.getClientByDni(dniUser));
    }

    public BillingSummaryResponseDto getBillingSummaryByPeriod(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("startDate y endDate son requeridos");
        }
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("startDate no puede ser mayor que endDate");
        }
        return this.saleRepository.getBillingSummary(startDate, endDate);
    }
}
