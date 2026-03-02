package com.uneg.pictorialArcane.domain.service;

import com.uneg.pictorialArcane.domain.dto.response.SaleResponseDto;
import com.uneg.pictorialArcane.domain.dto.response.UserResponseDto;
import com.uneg.pictorialArcane.domain.exception.SaleDoesNotExistsException;
import com.uneg.pictorialArcane.persistence.impl_repository.SaleRepository;
import com.uneg.pictorialArcane.persistence.impl_repository.UserEntityRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdministrationService {
    private final SaleRepository saleRepository;
    private final UserEntityRepository userEntityRepository;

    public AdministrationService(SaleRepository saleRepository, UserEntityRepository userEntityRepository) {
        this.saleRepository = saleRepository;
        this.userEntityRepository = userEntityRepository;
    }

    public List<SaleResponseDto> getAllPendingSales() {
        return saleRepository.getAllPendingSalesIn24HoursRange();
    }

    public void rejectPendingSale(Long saleId, String email) {
        if(saleRepository.getSaleById(saleId) == null){
            throw new SaleDoesNotExistsException(saleId);
        }

        UserResponseDto admin = this.userEntityRepository.getByEmail(email);
        this.saleRepository.rejectPendingSale(saleId, admin.dniUser());
    }
}
