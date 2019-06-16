package com.example.polls.payload;

import java.util.HashSet;
import java.util.Set;

import com.example.polls.model.Questionnaire;

import java.time.Instant;

public class CriteriaResponse {
    private Long id;
    private String name;
    private String description;
    private String type;
    private Boolean graded;
    private Set<Questionnaire> questionnaires = new HashSet<>();
    private UserSummary createdBy;
    private Instant creationDateTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Boolean getGraded() {
        return graded;
    }

    public void setGraded(Boolean graded) {
        this.graded = graded;
    }

    public Set<Questionnaire> getQuestionnaires() {
        return questionnaires;
    }

    public void setQuestionnaire(Set<Questionnaire> questionnaires) {
        this.questionnaires = questionnaires;
    }

    public UserSummary getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UserSummary createdBy) {
        this.createdBy = createdBy;
    }

    public Instant getCreationDateTime() {
        return creationDateTime;
    }

    public void setCreationDateTime(Instant creationDateTime) {
        this.creationDateTime = creationDateTime;
    }
}
