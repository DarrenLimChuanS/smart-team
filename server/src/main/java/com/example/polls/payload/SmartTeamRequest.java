package com.example.polls.payload;

import com.example.polls.model.Questionnaire;
import com.example.polls.model.Section;
import com.example.polls.model.User;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class SmartTeamRequest {

    @NotBlank
    private String name;

    @NotNull
    private Long noOfTeams;
    
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date smartteamStartdate;

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private Date smartteamEnddate;

    private Questionnaire questionnaire;

    private User user;

    private Section section;

    /* START OF GETTERS AND SETTERS */
    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getNoOfTeams() {
        return this.noOfTeams;
    }

    public void setNoOfTeams(Long noOfTeams) {
        this.noOfTeams = noOfTeams;
    }
    
    public Date getSmartteamStartdate() {
        return this.smartteamStartdate;
    }

    public void setSmartteamStartdate(Date smartteamStartdate) {
        this.smartteamStartdate = smartteamStartdate;
    }

    public Date getSmartteamEnddate() {
        return this.smartteamEnddate;
    }

    public void setSmartteamEnddate(Date smartteamEnddate) {
        this.smartteamEnddate = smartteamEnddate;
    }

    public Questionnaire getQuestionnaire() {
        return this.questionnaire;
    }

    public void setQuestionnaire(Questionnaire questionnaire) {
        this.questionnaire = questionnaire;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Section getSection() {
        return this.section;
    }

    public void setSection(Section section) {
        this.section = section;
    }

    @Override
    public String toString() {
        return "{" +
            " name='" + getName() + "'" +
            ", smartteamStartdate='" + getSmartteamStartdate() + "'" +
            ", smartteamEnddate='" + getSmartteamEnddate() + "'" +
            ", questionnaire='" + getQuestionnaire() + "'" +
            ", user='" + getUser() + "'" +
            ", section='" + getSection() + "'" +
            "}";
    }
    /* END OF GETTERS AND SETTERS */
}
