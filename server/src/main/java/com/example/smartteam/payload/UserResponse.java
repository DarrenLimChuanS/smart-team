package com.example.smartteam.payload;

import com.example.smartteam.model.Role;
import com.example.smartteam.model.Section;
import com.example.smartteam.model.SmartTeam;

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
    private Set<SmartTeam> smartteams = new HashSet<>();
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

    public Set<SmartTeam> getSmartteams() {
        return smartteams;
    }

    public void setSmartteams(Set<SmartTeam> smartteams) {
        this.smartteams = smartteams;
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
