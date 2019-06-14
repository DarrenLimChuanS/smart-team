package com.example.polls.model;

import com.example.polls.model.audit.DateAudit;
import org.hibernate.annotations.NaturalId;
import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Created by rajeevkumarsingh on 01/08/17.
 */

@Entity
@Table(name = "questionnaire", uniqueConstraints = {
        @UniqueConstraint(columnNames = {
            "name"
        })
})
public class Questionnaire extends DateAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long questionnaire_id;

    @NotBlank
    @Size(max = 255)
    private String name;

    @NotBlank
    @Size(max = 255)
    private String instruction;

    // MAPPING TESTING
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    // @OneToMany(mappedBy = "questionnaire", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    // private Set<Criteria> criteria = new HashSet<>();


    public Questionnaire() {

    }

    public Questionnaire(String name, String instruction) {
        this.name = name;
        this.instruction = instruction;
    }

    public Long getId() {
        return questionnaire_id;
    }

    public void setId(Long questionnaire_id) {
        this.questionnaire_id = questionnaire_id;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    
}