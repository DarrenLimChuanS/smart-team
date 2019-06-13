package com.example.polls.model;

import com.example.polls.model.audit.DateAudit;
import org.hibernate.annotations.NaturalId;
import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by rajeevkumarsingh on 01/08/17.
 */

@Entity
@Table(name = "criteria", uniqueConstraints = {
        @UniqueConstraint(columnNames = {
            "name"
        })
})
public class Criteria extends DateAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long criteria_id;

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

    // @ManyToMany(fetch = FetchType.LAZY)
    // @JoinTable(name = "user_roles",
    //         joinColumns = @JoinColumn(name = "user_id"),
    //         inverseJoinColumns = @JoinColumn(name = "role_id"))
    // private Set<Role> roles = new HashSet<>();

    public Criteria() {

    }

    public Criteria(String name, String type, boolean graded, String description) {
        this.name = name;
        this.type = type;
        this.graded = graded;
        this.description = description;
    }

    public Long getId() {
        return criteria_id;
    }

    public void setId(Long criteria_id) {
        this.criteria_id = criteria_id;
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
    
}