package com.ticketing.api.enums;

public enum Priority {
    LOW("Low"),
    MEDIUM("Medium"),
    HIGH("High");
    
    private final String displayName;
    
    Priority(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}