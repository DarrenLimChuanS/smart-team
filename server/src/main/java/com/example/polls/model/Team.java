package com.example.polls.model;

import com.example.polls.model.audit.UserDateAudit;
import com.fasterxml.jackson.annotation.JsonBackReference;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.lang.Nullable;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "team")
public class Team extends UserDateAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long teamId;

    @Nullable
    private Double complianceScore;

    // One way mapping
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "section_id", nullable = false)
    private Section section;

    // Mapped in another table
    @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.MERGE, CascadeType.PERSIST })
    @JoinTable(name = "team_users", joinColumns = { @JoinColumn(name = "team_id") }, inverseJoinColumns = {
            @JoinColumn(name = "user_id", referencedColumnName = "id") })
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonBackReference
    private Set<User> users = new HashSet<>();

    // One way mapping
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "smartteam_id", nullable = false)
    private SmartTeam smartteam;

    public Team() {
    }

    public Team(Long teamId, Double complianceScore, Section section, Set<User> users, SmartTeam smartteam) {
        this.teamId = teamId;
        this.complianceScore = complianceScore;
        this.section = section;
        this.users = users;
        this.smartteam = smartteam;
    }

    public Long getTeamId() {
        return this.teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public Double getComplianceScore() {
        return this.complianceScore;
    }

    public void setComplianceScore(Double complianceScore) {
        this.complianceScore = complianceScore;
    }

    public Section getSection() {
        return this.section;
    }

    public void setSection(Section section) {
        this.section = section;
    }

    public Set<User> getUsers() {
        return this.users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    public SmartTeam getSmartteam() {
        return this.smartteam;
    }

    public void setSmartteam(SmartTeam smartteam) {
        this.smartteam = smartteam;
    }

    @Override
    public String toString() {
        return "{" +
            " teamId='" + getTeamId() + "'" +
            ", complianceScore='" + getComplianceScore() + "'" +
            ", section='" + getSection() + "'" +
            ", users='" + getUsers() + "'" +
            ", smartteam='" + getSmartteam() + "'" +
            "}";
    }
}
