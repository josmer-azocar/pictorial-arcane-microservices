package com.uneg.pictorialArcane.domain.service;

import com.uneg.pictorialArcane.domain.dto.response.ArtWork2ResponseDto;
import com.uneg.pictorialArcane.domain.dto.response.SaleResponseDto;
import com.uneg.pictorialArcane.domain.dto.response.UserResponseDto;
import com.uneg.pictorialArcane.domain.exception.SaleDoesNotExistsException;
import com.uneg.pictorialArcane.persistence.impl_repository.ArtWorkRespository;
import com.uneg.pictorialArcane.persistence.impl_repository.SaleRepository;
import com.uneg.pictorialArcane.persistence.impl_repository.UserEntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AdministrationService {
    private final SaleRepository saleRepository;
    private final UserEntityRepository userEntityRepository;
    private final ArtWorkRespository artWorkRespository;

    public AdministrationService(SaleRepository saleRepository, UserEntityRepository userEntityRepository, ArtWorkRespository artWorkRespository) {
        this.saleRepository = saleRepository;
        this.userEntityRepository = userEntityRepository;
        this.artWorkRespository = artWorkRespository;
    }

    public List<SaleResponseDto> getAllPendingSales() {
        return saleRepository.getAllPendingSalesAfter24h();
    }

    public void rejectPendingSale(Long saleId, String email) {
        if(saleRepository.getSaleById(saleId) == null){
            throw new SaleDoesNotExistsException(saleId);
        }

        UserResponseDto admin = this.userEntityRepository.getByEmail(email);
        this.saleRepository.rejectPendingSale(saleId, admin.dniUser());
    }

    public Page<ArtWork2ResponseDto> getSoldArtworksByDate(LocalDate startDate, LocalDate endDate, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return artWorkRespository.findSoldArtWorksByDateRange(startDate, endDate, pageable);
    }

}
