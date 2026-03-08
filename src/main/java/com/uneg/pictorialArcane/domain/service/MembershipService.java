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
import java.time.LocalDateTime;

@Service
public class MembershipService {

    private final MembershipRepository membershipRepository;
    private final CrudClientRepository crudClientRepository;
    private static final Double MEMBERSHIP_COST = 10.0;

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
        newMembership.setPaymentDate(LocalDateTime.now());
        newMembership.setExpiryDate(LocalDate.now().plusYears(1));
        newMembership.setStatus(MembershipStatus.ACTIVE.name());

        return membershipRepository.save(newMembership);
    }

    public Page<MembershipResponseDto> filterMemberships(LocalDate startDate, LocalDate endDate, String status, int page, int size, String sortBy, Sort.Direction direction) {
        LocalDateTime start = (startDate != null) ? startDate.atStartOfDay() : null;
        LocalDateTime end = (endDate != null) ? endDate.atTime(23, 59, 59) : LocalDateTime.now();

        Pageable pageable = PageRequest.of(page, size, direction, sortBy);
        return membershipRepository.searchMemberships(status, start, end, pageable);
    }

    public MembershipResponseDto cancelMembership(Long id) {
        MembershipEntity entity = membershipRepository.findById(id)
                .orElseThrow(() -> new ActiveMembershipNotFoundException("Membership not found with ID: " + id));

        entity.setStatus(MembershipStatus.CANCELLED.name());
        return membershipRepository.save(entity);
    }
}
