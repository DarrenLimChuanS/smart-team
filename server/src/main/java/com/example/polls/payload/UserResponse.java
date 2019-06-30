package com.example.polls.payload;

import com.example.polls.model.Role;
import com.example.polls.model.Section;
import com.example.polls.model.SmartTeam;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

public class UserResponse {
    private Long id;
    private String name;
    private String username;
    private String email;
    private String password;
    private Set<Role> roles = new HashSet<>();
    private Set<Section> sections = new HashSet<>();
    private Set<SmartTeam> smartTeams = new HashSet<>();
    private UserSummary createdBy;
    private Instant creationDateTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public Set<Section> getSections() {
        return sections;
    }

    public void setSections(Set<Section> sections) {
        this.sections = sections;
    }

    public Set<SmartTeam> getSmartTeams() {
        return smartTeams;
    }

    public void setSmartTeams(Set<SmartTeam> smartTeams) {
        this.smartTeams = smartTeams;
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
