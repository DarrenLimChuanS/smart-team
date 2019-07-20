package com.example.smartteam.payload;

import com.example.smartteam.model.CriteriaCompliance;
import com.example.smartteam.model.Team;

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
