package com.uneg.pictorialArcane.persistence.impl_repository;

import com.uneg.pictorialArcane.domain.Enum.MembershipStatus;
import com.uneg.pictorialArcane.domain.dto.response.MembershipResponseDto;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudMembershipRepository;
import com.uneg.pictorialArcane.persistence.entity.MembershipEntity;
import com.uneg.pictorialArcane.persistence.mapper.MembershipMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public class MembershipRepository {

    private final CrudMembershipRepository crudMembershipRepository;
    private final MembershipMapper membershipMapper;

    @Autowired
    public MembershipRepository(CrudMembershipRepository crudMembershipRepository, MembershipMapper membershipMapper) {
        this.crudMembershipRepository = crudMembershipRepository;
        this.membershipMapper = membershipMapper;
    }

    public Optional<MembershipResponseDto> findActiveByClient(Long dniUser) {
        return crudMembershipRepository.findFirstByClient_DniUserAndStatus(dniUser, MembershipStatus.ACTIVE.name())
                .map(membershipMapper::toResponseDto);
    }

    public MembershipResponseDto save(MembershipEntity entity) {
        return membershipMapper.toResponseDto(crudMembershipRepository.save(entity));
    }

    public Page<MembershipResponseDto> searchMemberships(String status, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        Specification<MembershipEntity> specification = (root, query, criteriaBuilder) -> criteriaBuilder.conjunction();

        if (status != null) {
            specification = specification.and(hasStatus(status));
        }
        if (startDate != null) {
            specification = specification.and(hasPaymentDateOnOrAfter(startDate));
        }
        if (endDate != null) {
            specification = specification.and(hasPaymentDateOnOrBefore(endDate));
        }

        return crudMembershipRepository.findAll(specification, pageable)
                .map(membershipMapper::toResponseDto);
    }

    public Optional<MembershipEntity> findById(Long id) {
        return crudMembershipRepository.findById(id);
    }

    public int expireMemberships(LocalDate today) {
        return crudMembershipRepository.expireMemberships(today, MembershipStatus.ACTIVE.name(), MembershipStatus.EXPIRED.name());
    }

    private Specification<MembershipEntity> hasStatus(String status) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("status"), status);
    }

    private Specification<MembershipEntity> hasPaymentDateOnOrAfter(LocalDate startDate) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.greaterThanOrEqualTo(root.get("paymentDate"), startDate);
    }

    private Specification<MembershipEntity> hasPaymentDateOnOrBefore(LocalDate endDate) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.lessThanOrEqualTo(root.get("paymentDate"), endDate);
    }
}
