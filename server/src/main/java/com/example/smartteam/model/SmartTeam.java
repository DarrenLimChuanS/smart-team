package com.example.smartteam.model;

import com.example.smartteam.model.audit.DateAudit;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.Date;
import javax.persistence.*;
import org.springframework.lang.Nullable;



@Entity
@Table(name = "smartteam")
public class SmartTeam extends DateAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long smartteamId;

    /*
     * DateAudit's Created_at and Updated_at
     */

    // SmartTeam name for purpose of initiation
    private String name;

    // Number of Teams
    @Nullable
    private Long noOfTeams;

    // SmartTeam start date, also the end time for the questionnaire
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date smartteamStartdate;

    // SmartTeam end date, validity after team is formed
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date smartteamEnddate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "questionnaire_id", nullable = false)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Questionnaire questionnaire;

    // User ID of Teacher that initiated SmartTeam formation session
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "initiated_by", nullable = false)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    @JsonBackReference("smartteam_initiator")
    private User user;

    // Section it was initiated on
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "section_id", nullable = false)
    @JsonBackReference("section_smartteam")
    private Section section;

    public SmartTeam() {

    }

    public SmartTeam(Long smartteamId, String name, Long noOfTeams, Date smartteamStartdate, Date smartteamEnddate) {
        this.smartteamId = smartteamId;
        this.name = name;
        this.noOfTeams = noOfTeams;
        this.smartteamStartdate = smartteamStartdate;
        this.smartteamEnddate = smartteamEnddate;
    }

    /* START OF GETTERS AND SETTERS */
    public Long getSmartteamId() {
        return this.smartteamId;
    }

    public void setSmartteamId(Long smartteamId) {
        this.smartteamId = smartteamId;
    }

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
        return "{" + " smartteamId='" + getSmartteamId() + "'" + ", smartteamStartdate='" + getSmartteamStartdate()
                + "'" + ", smartteamEnddate='" + getSmartteamEnddate() + "'" + ", questionnaire='" + getQuestionnaire()
                + "'" + ", user='" + getUser() + "'" + ", section='" + getSection() + "'" + "}";
    }
    /* END OF GETTERS AND SETTERS */
}