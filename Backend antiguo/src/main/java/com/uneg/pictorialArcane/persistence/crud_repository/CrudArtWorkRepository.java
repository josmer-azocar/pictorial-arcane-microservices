package com.uneg.pictorialArcane.persistence.crud_repository;

import com.uneg.pictorialArcane.domain.dto.response.ArtWork2ResponseDto;
import com.uneg.pictorialArcane.persistence.entity.ArtWorkEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;


public interface CrudArtWorkRepository extends CrudRepository<ArtWorkEntity, Long> {

    @Query("SELECT a FROM ArtWorkEntity a WHERE a.name = :name")
    ArtWorkEntity findByName(
            @Param("name") String name);

    ArtWorkEntity findFirstByIdArtWork(Long id);
    ArtWorkEntity deleteByIdArtWork(Long id);

    @Query("SELECT o FROM ArtWorkEntity o WHERE " +
            "(:id_genre IS NULL OR o.genre.idGenre = :id_genre) AND " +
            "(:id_artist IS NULL OR o.artist.idArtist = :id_artist) AND " +
            "(:min_price IS NULL OR o.price >= :min_price) AND " +
            "(:max_price IS NULL OR o.price <= :max_price) AND " +
            "(o.status = 'AVAILABLE') AND" +
            "(LOWER(o.name) LIKE LOWER(CONCAT('%', :title, '%')))"
    )
    Page<ArtWorkEntity> searchArtWorkByFilters(
            @Param("id_genre") Long idGenre,
            @Param("id_artist") Long idArtist,
            @Param("title") String title,
            @Param("min_price") Double min,
            @Param("max_price") Double max,
            Pageable pageable);

    @Query("SELECT v.artWork FROM SaleEntity v WHERE v.saleStatus = 'APPROVED' AND v.date >= :startDate AND v.date <= :endDate")
    Page<ArtWorkEntity> findSoldArtWorksByDateRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable
    );
}
