package com.example.polls.model;

import com.example.polls.model.audit.UserDateAudit;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "questionnaire", uniqueConstraints = { @UniqueConstraint(columnNames = { "name" }) })
public class Questionnaire extends UserDateAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long questionnaireId;

    @NotBlank
    @Size(max = 255)
    private String name;

    @Size(max = 255)
    private String instruction;

    @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.MERGE, CascadeType.PERSIST })
    @JoinTable(name = "questionnaire_criteria", joinColumns = { @JoinColumn(name = "id") }, inverseJoinColumns = {
            @JoinColumn(name = "criteria_id") })
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonManagedReference
    private Set<Criteria> criteria = new HashSet<>();

    @OneToMany(mappedBy = "questionnaire", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonBackReference
    private Set<SmartTeam> smartteams = new HashSet<>();

    public Questionnaire() {

    }

    public Questionnaire(String name, String instruction) {
        this.name = name;
        this.instruction = instruction;
    }

    public Long getQuestionnaireId() {
        return questionnaireId;
    }

    public void setQuestionnaireId(Long questionnaireId) {
        this.questionnaireId = questionnaireId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getInstruction() {
        return instruction;
    }

    public void setInstruction(String instruction) {
        this.instruction = instruction;
    }

    public Set<Criteria> getCriteria() {
        return criteria;
    }

    public void setCriteria(Set<Criteria> criteria) {
        this.criteria = criteria;

    }

    public Set<SmartTeam> getSmartteams() {
        return smartteams;
    }

    public void setSmartTeams(Set<SmartTeam> smartteams) {
        this.smartteams = smartteams;
    }
}