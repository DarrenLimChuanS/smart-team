package com.example.polls.model;

import com.example.polls.model.audit.UserDateAudit;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "criteria")
public class Criteria extends UserDateAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long criteriaId;

    @NotBlank
    @Size(max = 40)
    private String name;

    @NotBlank
    @Size(max = 15)
    private String type;

    private Boolean graded;

    @NotBlank
    @Size(max = 255)
    private String description;

    @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.MERGE, CascadeType.PERSIST }, mappedBy = "criteria")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonBackReference
    private Set<Questionnaire> questionnaires = new HashSet<>();

    @OneToMany(mappedBy = "criteria", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonManagedReference
    private Set<Poll> polls = new HashSet<>();

    public Long getId() {
        return criteriaId;
    }

    public void setId(Long criteriaId) {
        this.criteriaId = criteriaId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public void setQuestionnaires(Set<Questionnaire> questionnaires) {
        this.questionnaires = questionnaires;
    }

    public Set<Poll> getPolls() {
        return polls;
    }

    public void addPoll(Poll poll) {
        polls.add(poll);
        poll.setCriteria(this);
    }

    public void removePoll(Poll poll) {
        polls.remove(poll);
        poll.setCriteria(null);
    }

}