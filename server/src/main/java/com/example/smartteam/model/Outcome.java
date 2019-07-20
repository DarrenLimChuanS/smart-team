package com.example.smartteam.model;

import com.example.smartteam.model.audit.UserDateAudit;

import javax.persistence.*;

public class Outcome extends UserDateAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long outcomeId;

    private Long criteriaId;

    private String name;

    private String outcome;

    public Long getId() {
        return outcomeId;
    }

    public void setId(Long outcomeId) {
        this.outcomeId = outcomeId;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}