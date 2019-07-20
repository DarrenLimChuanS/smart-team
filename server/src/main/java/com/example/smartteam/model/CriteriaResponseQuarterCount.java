package com.example.smartteam.model;

public class CriteriaResponseQuarterCount {

    private Long criteriaId;
    private String outcome;
    private Long outcomeCount;

    public CriteriaResponseQuarterCount(Long criteriaId, String outcome, Long outcomeCount) {
        this.criteriaId = criteriaId;
        this.outcome = outcome;
        this.outcomeCount = outcomeCount;
    }

    public Long getCriteriaId() {
        return criteriaId;
    }

    public void setCriteriaId(Long criteriaId) {
        this.criteriaId = criteriaId;
    }

    public String getOutcome() {
        return outcome;
    }

    public void setOutcome(String outcome) {
        this.outcome = outcome;
    }

    public Long getOutcomeCount() {
        return outcomeCount;
    }

    public void setOutcomeCount(Long outcomeCount) {
        this.outcomeCount = outcomeCount;
    }
}
