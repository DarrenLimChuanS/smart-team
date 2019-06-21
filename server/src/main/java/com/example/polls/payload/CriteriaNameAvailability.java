package com.example.polls.payload;

public class CriteriaNameAvailability {
    private Boolean available;

    public CriteriaNameAvailability(Boolean available) {
        this.available = available;
    }

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }
}
