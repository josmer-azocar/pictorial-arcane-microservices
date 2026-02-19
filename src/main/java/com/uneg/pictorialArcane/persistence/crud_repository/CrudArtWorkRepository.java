package com.uneg.pictorialArcane.persistence.crud_repository;

import com.uneg.pictorialArcane.persistence.entity.ArtWorkEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;


public interface CrudArtWorkRepository extends CrudRepository<ArtWorkEntity, Long> {

    ArtWorkEntity findByName(String name);
    ArtWorkEntity findFirstByIdArtWork(Long id);
    ArtWorkEntity deleteByIdArtWork(Long id);

    @Query("SELECT o FROM ArtWorkEntity o WHERE " +
            "(:id_gender IS NULL OR o.gender.idGender = :id_gender) AND " +
            "(:id_artist IS NULL OR o.artist.idArtist = :id_artist) AND " +
            "(:min_price IS NULL OR o.price >= :min_price) AND " +
            "(:max_price IS NULL OR o.price <= :max_price) AND " +
            "(o.status = 'AVAILABLE') AND" +
            "(:title IS NULL OR LOWER(o.name) LIKE LOWER(CONCAT('%', :title, '%')))"
    )
    Page<ArtWorkEntity> searchArtWorkByFilters(
            @Param("id_gender") Long idGender,
            @Param("id_artist") Long idArtist,
            @Param("title") String title,
            @Param("min_price") Double min,
            @Param("max_price") Double max,
            Pageable pageable);
}
