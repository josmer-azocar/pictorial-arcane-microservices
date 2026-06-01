package com.pictorialarcane.core_service.persistence.impl_repository;

import com.pictorialarcane.core_service.domain.Enum.SaleStatus;
import com.pictorialarcane.core_service.domain.Enum.ShippingStatus;
import com.pictorialarcane.core_service.domain.dto.request.PaymentRequestDto;
import com.pictorialarcane.core_service.domain.dto.response.BillingSaleItemResponseDto;
import com.pictorialarcane.core_service.domain.dto.response.BillingSummaryResponseDto;
import com.pictorialarcane.core_service.domain.dto.response.PurchaseResponseDto;
import com.pictorialarcane.core_service.domain.dto.response.SaleResponseDto;
import com.pictorialarcane.core_service.domain.exception.SaleException;
import com.pictorialarcane.core_service.persistence.crud_repository.CrudPaymentRepository;
import com.pictorialarcane.core_service.persistence.crud_repository.CrudSaleRepositoy;
import com.pictorialarcane.core_service.persistence.crud_repository.CrudUserRepository;
import com.pictorialarcane.core_service.persistence.entity.*;
import com.pictorialarcane.core_service.persistence.mapper.PaymentMapper;
import com.pictorialarcane.core_service.persistence.mapper.SaleMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class SaleRepository {

    private final CrudSaleRepositoy crudSaleRepository;
    private final CrudUserRepository crudUserRepository;
    private final SaleMapper saleMapper;
    private final Double TAX_AMOUNT = 0.16;
    private final PaymentMapper paymentMapper;
    private final CrudPaymentRepository crudPaymentRepository;


    public SaleRepository(CrudSaleRepositoy crudSaleRepository, CrudUserRepository crudUserRepository, SaleMapper saleMapper, PaymentMapper paymentMapper, CrudPaymentRepository crudPaymentRepository) {
        this.crudSaleRepository = crudSaleRepository;
        this.crudUserRepository = crudUserRepository;
        this.saleMapper = saleMapper;
        this.paymentMapper = paymentMapper;
        this.crudPaymentRepository = crudPaymentRepository;
    }

    public SaleResponseDto getSaleById(Long saleId){
        return this.saleMapper.toResponseDto(this.crudSaleRepository.findByIdSale(saleId));
    }

    public SaleEntity createReservedSale(Long idArtwork, Double price, Double commissionRate, ClientEntity client) {
        SaleEntity sale = new SaleEntity();
        sale.setIdArtwork(idArtwork);
        sale.setClient(client);
        sale.setAdmin(null);
        sale.setDate(null);
        sale.setDescription(null);
        sale.setPrice(price);

        sale.setProfitPercentage(commissionRate);
        sale.setProfitAmount(commissionRate * sale.getPrice());
        sale.setTaxAmount(sale.getPrice() * TAX_AMOUNT);
        sale.setTotalPaid(sale.getPrice() + sale.getTaxAmount());
        sale.setShippingAddress(null);
        sale.setShippingStatus(ShippingStatus.PENDING.name());
        sale.setSaleStatus(SaleStatus.PENDING.name());

        return crudSaleRepository.save(sale);
    }

    public List<SaleResponseDto> getAllPendingSalesAfter24h(){
        return this.saleMapper.toResponseDto(
                this.crudSaleRepository.findAllBySaleStatusAndCreatedAtBefore(
                        SaleStatus.PENDING.name(), LocalDateTime.now().minusHours(24)));

    }

    public List<SaleResponseDto> getAllPendingSales(){
        return this.saleMapper.toResponseDto(
                this.crudSaleRepository.findAllBySaleStatusAndCreatedAtBefore(
                        SaleStatus.PENDING.name(), LocalDateTime.now()));

    }

    public void rejectPendingSale(Long saleId, Long adminId) {
        SaleEntity sale = this.crudSaleRepository.findByIdSale(saleId);
        sale.setAdmin(this.crudUserRepository.findByDniUser(adminId));
        sale.setSaleStatus(SaleStatus.CANCELED.name());
        sale.setShippingStatus(ShippingStatus.CANCELED.name());
        this.crudSaleRepository.save(sale);

        // TODO: notificar al artwork-service (MongoDB) que la obra idArtwork vuelve a estar disponible.
    }

    public Page<PurchaseResponseDto> getClientPurchases(int page, int size, Long dniUser) {
        return this.crudSaleRepository.getClientPurchases(dniUser, PageRequest.of(page, size))
                .map(sale -> new PurchaseResponseDto(
                        sale.getIdSale(),
                        sale.getIdArtwork(),
                        sale.getDate(),
                        sale.getDescription(),
                        sale.getPrice(),
                        sale.getTaxAmount(),
                        sale.getTotalPaid(),
                        sale.getShippingAddress(),
                        Optional.ofNullable(sale.getShippingStatus())
                                .map(String::toUpperCase)
                                .map(ShippingStatus::valueOf)
                                .orElse(null),
                        Optional.ofNullable(sale.getSaleStatus())
                                .map(String::toUpperCase)
                                .map(SaleStatus::valueOf)
                                .orElse(null)
                ));
    }

    public SaleResponseDto confirmSale(Long saleId, String email, PaymentRequestDto paymentRequestDto, String description, String direction) {
        SaleEntity saleEntity = crudSaleRepository.findByIdSale(saleId);
        UserEntity admin = crudUserRepository.findFirstByEmail(email);

        if (!saleEntity.getSaleStatus().equals(SaleStatus.PENDING.name())) throw new SaleException(saleId);

        // Se registra el pago de la venta ingresado por el admin
        PaymentEntity payment = paymentMapper.toEntity(paymentRequestDto);
        payment.setSale(saleEntity);
        crudPaymentRepository.save(payment);

        saleEntity.setAdmin(admin);
        saleEntity.setDate(LocalDate.now());
        saleEntity.setDescription(description);
        saleEntity.setShippingAddress(direction);
        saleEntity.setSaleStatus(SaleStatus.APPROVED.name());

        SaleResponseDto response = saleMapper.toResponseDto(crudSaleRepository.save(saleEntity));

        // TODO: notificar al artwork-service (MongoDB) que la obra idArtwork quedó vendida (SOLD).

        return response;
    }

    public SaleResponseDto updateShippingStatus(Long saleId, ShippingStatus shippingStatus) {
        SaleEntity saleEntity = crudSaleRepository.findByIdSale(saleId);

        if (!saleEntity.getShippingStatus().equals(ShippingStatus.PENDING.name())) throw new RuntimeException("The current Shipping Status must be PENDING to be updated");
        if (!saleEntity.getSaleStatus().equals(SaleStatus.APPROVED.name())) throw new SaleException(saleId, saleEntity.getSaleStatus());

        saleEntity.setShippingStatus(shippingStatus.name());

        return saleMapper.toResponseDto(crudSaleRepository.save(saleEntity));
    }

    public BillingSummaryResponseDto getBillingSummary(LocalDate startDate, LocalDate endDate) {
        List<SaleEntity> sales = this.crudSaleRepository.findApprovedSalesByDateRange(startDate, endDate);

        List<BillingSaleItemResponseDto> items = sales.stream()
                .map(sale -> new BillingSaleItemResponseDto(
                        sale.getIdSale(),
                        sale.getDate(),
                        sale.getIdArtwork(),
                        sale.getPrice(),
                        sale.getProfitPercentage(),
                        sale.getProfitAmount(),
                        sale.getTotalPaid()
                ))
                .toList();

        double totalCollected = sales.stream()
                .map(SaleEntity::getTotalPaid)
                .filter(v -> v != null)
                .mapToDouble(Double::doubleValue)
                .sum();

        double totalMuseumProfit = sales.stream()
                .map(SaleEntity::getProfitAmount)
                .filter(v -> v != null)
                .mapToDouble(Double::doubleValue)
                .sum();

        return new BillingSummaryResponseDto(startDate, endDate, totalCollected, totalMuseumProfit, items);
    }
}