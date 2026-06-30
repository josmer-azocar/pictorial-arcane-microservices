package com.pictorial.audit_service.exception;

public class ResourceNotFoundException extends RuntimeException {
    private final String resourceType;

    public ResourceNotFoundException(String resourceType, String message) {
        super(message);
        this.resourceType = resourceType;
    }

    public String getResourceType() {
        return resourceType;
    }
}
