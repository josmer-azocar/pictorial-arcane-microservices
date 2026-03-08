package com.uneg.pictorialArcane.persistence.impl_repository;

import com.uneg.pictorialArcane.domain.Enum.MembershipStatus;
import com.uneg.pictorialArcane.domain.dto.response.MembershipResponseDto;
import com.uneg.pictorialArcane.persistence.crud_repository.CrudMembershipRepository;
import com.uneg.pictorialArcane.persistence.entity.MembershipEntity;
import com.uneg.pictorialArcane.persistence.mapper.MembershipMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

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
}
