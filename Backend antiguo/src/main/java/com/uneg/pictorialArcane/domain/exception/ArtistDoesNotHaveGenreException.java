package com.uneg.pictorialArcane.domain.exception;

public class ArtistDoesNotHaveGenreException extends RuntimeException {
    public ArtistDoesNotHaveGenreException(Long idArtist, Long idGenre) {
        super("The Artist with id: " + idArtist + " does not have the Genre with id: " + idGenre);
    }
}

