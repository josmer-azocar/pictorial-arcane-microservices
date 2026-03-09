package com.uneg.pictorialArcane.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "clients")
public class ClientEntity {

    @Id
    private Long dniUser;

    @Column(name = "credit_card_number")
    private BigInteger creditCardNumber;

    @Column(name = "security_code")
    private String securityCode;

    @Column(name = "postal_code")
    private Integer postalCode;

    @OneToOne(optional = false)
    @MapsId
    @JoinColumn(name = "dni", nullable = false)
    private UserEntity user;

    @OneToMany(mappedBy = "client", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<ClientAnswerEntity> answers = new ArrayList<>();

    @OneToMany(mappedBy = "client")
    private List<SaleEntity> sales;

    @OneToMany(mappedBy = "client")
    private List<MembershipEntity> memberships;

    public Long getDniUser() {
        return dniUser;
    }

    public void setDniUser(Long dniUser) {
        this.dniUser = dniUser;
    }

    public BigInteger getCreditCardNumber() {
        return creditCardNumber;
    }

    public void setCreditCardNumber(BigInteger creditCardNumber) {
        this.creditCardNumber = creditCardNumber;
    }

    public String getSecurityCode() {
        return securityCode;
    }

    public void setSecurityCode(String securityCode) {
        this.securityCode = securityCode;
    }

    public Integer getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(Integer postalCode) {
        this.postalCode = postalCode;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public String getFullName(){
        return this.user.getFullName();
    }
}
