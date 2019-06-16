package com.example.polls.model;

import com.example.polls.model.audit.UserDateAudit;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "criteria", uniqueConstraints = { @UniqueConstraint(columnNames = { "name" }) })
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

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.MERGE, CascadeType.PERSIST }, mappedBy = "criteria")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Set<Questionnaire> questionnaires = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.MERGE, CascadeType.PERSIST })
    @JoinTable(name = "criteria_polls", joinColumns = { @JoinColumn(name = "criteria_id") }, inverseJoinColumns = {
            @JoinColumn(name = "poll_id", referencedColumnName = "id") })
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Set<Poll> polls = new HashSet<>();

    public Criteria() {

    }

    public Criteria(String name, String type, boolean graded, String description) {
        this.name = name;
        this.type = type;
        this.graded = graded;
        this.description = description;
    }

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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public void setPolls(Set<Poll> polls) {
        this.polls = polls;
    }

}