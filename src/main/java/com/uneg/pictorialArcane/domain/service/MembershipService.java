package com.uneg.pictorialArcane.domain.service;

import com.uneg.pictorialArcane.domain.Enum.MembershipStatus;
import com.uneg.pictorialArcane.domain.dto.response.MembershipResponseDto;
import com.uneg.pictorialArcane.domain.exception.ActiveMembershipAlreadyExistsException;
import com.uneg.pictorialArcane.domain.exception.ActiveMembershipNotFoundException;
import com.uneg.pictorialArcane.domain.exception.UserDoesNotExistsException;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudClientRepository;
import com.uneg.pictorialArcane.persistence.entity.ClientEntity;
import com.uneg.pictorialArcane.persistence.entity.MembershipEntity;
import com.uneg.pictorialArcane.persistence.impl_repository.MembershipRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Set;

@Service
public class MembershipService {

    private static final Double MEMBERSHIP_COST = 10.0;
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "idMembership",
            "amountPaid",
            "paymentDate",
            "expiryDate",
            "status"
    );

    private final MembershipRepository membershipRepository;
    private final CrudClientRepository crudClientRepository;

    public MembershipService(MembershipRepository membershipRepository, CrudClientRepository crudClientRepository) {
        this.membershipRepository = membershipRepository;
        this.crudClientRepository = crudClientRepository;
    }

    public MembershipResponseDto getActiveMembership(String email) {
        ClientEntity client = crudClientRepository.findByUser_Email(email);
        if (client == null) {
            throw new UserDoesNotExistsException("Client not found for email: " + email);
        }

        return membershipRepository.findActiveByClient(client.getDniUser())
                .orElseThrow(() -> new ActiveMembershipNotFoundException("Client does not have an active membership"));
    }

    public MembershipResponseDto renewMembership(String email) {
        ClientEntity client = crudClientRepository.findByUser_Email(email);
        if (client == null) {
            throw new UserDoesNotExistsException("Client not found for email: " + email);
        }

        if (membershipRepository.findActiveByClient(client.getDniUser()).isPresent()) {
            throw new ActiveMembershipAlreadyExistsException("Client already has an active membership");
        }

        MembershipEntity newMembership = new MembershipEntity();
        newMembership.setClient(client);
        newMembership.setAmountPaid(MEMBERSHIP_COST);
        newMembership.setPaymentDate(LocalDate.now());
        newMembership.setExpiryDate(LocalDate.now().plusYears(1));
        newMembership.setStatus(MembershipStatus.ACTIVE.name());

        return membershipRepository.save(newMembership);
    }

    public Page<MembershipResponseDto> filterMemberships(LocalDate startDate, LocalDate endDate, String status, int page, int size, String sortBy, Sort.Direction direction) {
        validateMembershipFilters(startDate, endDate, page, size, sortBy);

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, normalizeSortBy(sortBy)));
        return membershipRepository.searchMemberships(normalizeStatus(status), startDate, endDate, pageable);
    }

    public MembershipResponseDto cancelMembership(Long id) {
        MembershipEntity entity = membershipRepository.findById(id)
                .orElseThrow(() -> new ActiveMembershipNotFoundException("Membership not found with ID: " + id));

        entity.setStatus(MembershipStatus.CANCELLED.name());
        return membershipRepository.save(entity);
    }

    private void validateMembershipFilters(LocalDate startDate, LocalDate endDate, int page, int size, String sortBy) {
        if (page < 0) {
            throw new IllegalArgumentException("Page number cannot be negative");
        }
        if (size <= 0) {
            throw new IllegalArgumentException("Page size must be greater than zero");
        }
        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }

        String normalizedSortBy = normalizeSortBy(sortBy);
        if (!ALLOWED_SORT_FIELDS.contains(normalizedSortBy)) {
            throw new IllegalArgumentException("Invalid sort field: " + normalizedSortBy);
        }
    }

    private String normalizeStatus(String status) {
        if (status == null || status.isBlank()) {
            return null;
        }
        return status.trim().toUpperCase();
    }

    private String normalizeSortBy(String sortBy) {
        if (sortBy == null || sortBy.isBlank()) {
            return "paymentDate";
        }
        return sortBy.trim();
    }
}
