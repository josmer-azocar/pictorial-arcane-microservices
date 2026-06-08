package com.pictorial.audit_service.persistence.tables;

import lombok.*;
import org.springframework.data.cassandra.core.cql.Ordering;
import org.springframework.data.cassandra.core.cql.PrimaryKeyType;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyClass;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyColumn;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

@Builder
@Data
@Getter
@Setter
@PrimaryKeyClass
public class BillingByMonthKey implements Serializable {

    @PrimaryKeyColumn(name = "year_month", type = PrimaryKeyType.PARTITIONED, ordinal = 0)
    private String yearMonth;

    @PrimaryKeyColumn(name = "sale_date", type = PrimaryKeyType.CLUSTERED, ordinal = 1, ordering = Ordering.DESCENDING)
    private LocalDate saleDate; // Mapea el tipo 'date' de Cassandra

    @PrimaryKeyColumn(name = "sale_id", type = PrimaryKeyType.CLUSTERED, ordinal = 2, ordering = Ordering.DESCENDING)
    private Long saleId;

    public BillingByMonthKey() {}

    public BillingByMonthKey(String yearMonth, LocalDate saleDate, Long saleId) {
        this.yearMonth = yearMonth;
        this.saleDate = saleDate;
        this.saleId = saleId;
    }

    // Getters y Setters

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BillingByMonthKey that = (BillingByMonthKey) o;
        return Objects.equals(yearMonth, that.yearMonth) &&
                Objects.equals(saleDate, that.saleDate) &&
                Objects.equals(saleId, that.saleId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(yearMonth, saleDate, saleId);
    }
}
