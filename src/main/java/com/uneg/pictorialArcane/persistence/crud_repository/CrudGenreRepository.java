package com.uneg.pictorialArcane.persistence.crud_repository;


import com.uneg.pictorialArcane.persistence.entity.GenreEntity;
import org.springframework.data.repository.CrudRepository;

public interface CrudGenreRepository extends CrudRepository<GenreEntity, Long> {
    GenreEntity findFirstByIdGenre(Long idGenre);
}