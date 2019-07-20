package com.example.smartteam.payload;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import java.util.HashSet;
import java.util.Set;

import com.example.smartteam.model.Criteria;
import com.example.smartteam.model.User;

public class QuestionnaireRequest {

    @NotBlank
    @Size(max = 255)
    private String name;

    @Size(max = 255)
    private String instruction;

    private User user;

    private Set<Criteria> criteria = new HashSet<>();

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

    public Set<Criteria> getCriteria() {
        return criteria;
    }

    public void setCriteria(Set<Criteria> criteria) {
        this.criteria = criteria;
    }
}
