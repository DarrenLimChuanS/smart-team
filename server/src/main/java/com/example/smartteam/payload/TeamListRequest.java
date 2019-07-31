package com.example.smartteam.payload;

import com.example.smartteam.model.CriteriaCompliance;
import com.example.smartteam.model.Team;

import java.util.List;

public class TeamListRequest {

    private List<Team> team;
    private List<CriteriaCompliance> criteriaCompliances;
    private int swapPassThreshold;

    public TeamListRequest() {
    }

    public TeamListRequest(List<Team> team) {
        this.team = team;
    }

    public TeamListRequest(List<Team> team, List<CriteriaCompliance> criteriaCompliances) {
        this.team = team;
        this.criteriaCompliances = criteriaCompliances;
    }

    public TeamListRequest(List<Team> team, List<CriteriaCompliance> criteriaCompliances, int swapPassThreshold) {
        this.team = team;
        this.criteriaCompliances = criteriaCompliances;
        this.swapPassThreshold = swapPassThreshold;
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

    /**
     * @return the swapPassThreshold
     */
    public int getSwapPassThreshold() {
        return this.swapPassThreshold;
    }

    /**
     * @param swapPassThreshold the swapPassThreshold to set
     */
    public void setSwapPassThreshold(int swapPassThreshold) {
        this.swapPassThreshold = swapPassThreshold;
    }

    @Override
    public String toString() {
        return "{" +
            " team='" + getTeam() + "'" +
            ", criteriaCompliances='" + getCriteriaCompliances() + "'" +
            ", swapPassThreshold='" + getSwapPassThreshold() + "'" +
            "}";
    }

}
