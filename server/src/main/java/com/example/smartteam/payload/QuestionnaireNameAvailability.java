package com.example.smartteam.payload;

public class QuestionnaireNameAvailability {
    private Boolean available;

    public QuestionnaireNameAvailability(Boolean available) {
        this.available = available;
    }

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }
}
