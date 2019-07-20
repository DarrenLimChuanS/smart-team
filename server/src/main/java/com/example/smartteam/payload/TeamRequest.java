package com.example.smartteam.payload;

import com.example.smartteam.model.CriteriaCompliance;
import com.example.smartteam.model.Team;

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
