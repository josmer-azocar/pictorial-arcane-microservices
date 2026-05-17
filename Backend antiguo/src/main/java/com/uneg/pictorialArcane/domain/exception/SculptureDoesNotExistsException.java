package com.uneg.pictorialArcane.domain.exception;

public class SculptureDoesNotExistsException extends RuntimeException {
    public SculptureDoesNotExistsException(Long id) {

      super("Sculpture with id " + id + " does not exist.");
    }
}
