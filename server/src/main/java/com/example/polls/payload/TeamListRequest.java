package com.example.polls.payload;

import com.example.polls.model.CriteriaCompliance;
import com.example.polls.model.Section;
import com.example.polls.model.SmartTeam;
import com.example.polls.model.Team;
import com.example.polls.model.User;
import com.example.polls.model.audit.UserDateAudit;
import com.fasterxml.jackson.annotation.JsonBackReference;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.lang.Nullable;

import javax.persistence.*;
import java.util.HashSet;
import java.util.List;

public class TeamListRequest {

    private List<Team> team;
    private List<CriteriaCompliance> criteriaCompliances;

    public TeamListRequest() {
    }

    public TeamListRequest(List<Team> team) {
        this.team = team;
    }

    public TeamListRequest(List<Team> team, List<CriteriaCompliance> criteriaCompliances) {
        this.team = team;
        this.criteriaCompliances = criteriaCompliances;
    }

    public List<Team> getTeam() {
        return this.team;
    }

    public void setTeam(List<Team> team) {
        this.team = team;
    }

    public List<CriteriaCompliance> getCriteriaCompliances() {
        return this.criteriaCompliances;
    }

    public void setCriteriaCompliances(List<CriteriaCompliance> criteriaCompliances) {
        this.criteriaCompliances = criteriaCompliances;
    }

    @Override
    public String toString() {
        return "{" + " team='" + getTeam() + "'" + ", criteriaCompliances='" + getCriteriaCompliances() + "'" + "}";
    }

}
