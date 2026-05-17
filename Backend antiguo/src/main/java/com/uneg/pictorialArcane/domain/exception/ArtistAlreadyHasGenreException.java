package com.uneg.pictorialArcane.domain.exception;

public class ArtistAlreadyHasGenreException extends RuntimeException {
    public ArtistAlreadyHasGenreException(Long idArtist, Long idGenre) {
        super("The Artist with id: " + idArtist + " already has the Genre with id: " + idGenre);
    }
}

