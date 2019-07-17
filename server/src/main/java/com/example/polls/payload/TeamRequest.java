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

public class TeamRequest {

    private Team team;
    private List<CriteriaCompliance> criteriaCompliances;

    public Team getTeam() {
        return this.team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public List<CriteriaCompliance> getCriteriaCompliances() {
        return this.criteriaCompliances;
    }

    public void setCriteriaCompliances(List<CriteriaCompliance> criteriaCompliances) {
        this.criteriaCompliances = criteriaCompliances;
    }
}
