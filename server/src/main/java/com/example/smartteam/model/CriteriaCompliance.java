package com.example.smartteam.model;

public class CriteriaCompliance {

    private Long criteriaId;
    private String criteriaName;
    private Long diversityScale;

    public CriteriaCompliance() {
    }

    public CriteriaCompliance(Long criteriaId, String criteriaName, Long diversityScale) {
        this.criteriaId = criteriaId;
        this.criteriaName = criteriaName;
        this.diversityScale = diversityScale;
    }

    public Long getCriteriaId() {
        return this.criteriaId;
    }

    public void setCriteriaId(Long criteriaId) {
        this.criteriaId = criteriaId;
    }

    public String getCriteriaName() {
        return this.criteriaName;
    }

    public void setCriteriaName(String criteriaName) {
        this.criteriaName = criteriaName;
    }

    public Long getDiversityScale() {
        return this.diversityScale;
    }

    public void setDiversityScale(Long diversityScale) {
        this.diversityScale = diversityScale;
    }

    @Override
    public String toString() {
        return "{" +
            " criteriaId='" + getCriteriaId() + "'" +
            ", criteriaName='" + getCriteriaName() + "'" +
            ", diversityScale='" + getDiversityScale() + "'" +
            "}";
    }

}
