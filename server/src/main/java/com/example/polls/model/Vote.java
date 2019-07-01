package com.example.polls.model;

import com.example.polls.model.audit.DateAudit;
import javax.persistence.*;

@Entity
@Table(name = "votes", uniqueConstraints = {
        @UniqueConstraint(columnNames = {
                "smartteam_id",
                "poll_id",
                "user_id"
        })
})
public class Vote extends DateAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /* 
    DateAudit's Created_at and Updated_at
    */

    // SmartTeam ID to determine SmartTeam formation session
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "smartteam_id", nullable = false)
    private SmartTeam smartteam;

    // User ID of Student for response
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Criteria ID of the questionnaire
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "criteria_id", nullable = false)
    private Criteria criteria;

    // Poll ID of the criteria
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "poll_id", nullable = false)
    private Poll poll;

    // Choice ID to be nullable, updated when student responded
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "choice_id", nullable = true)
    private Choice choice;

    // Outcome to be nullable, updated when student responded
    private String outcome;

    /* START OF GETTERS AND SETTERS */
    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SmartTeam getSmartteam() {
        return this.smartteam;
    }

    public void setSmartteam(SmartTeam smartteam) {
        this.smartteam = smartteam;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Criteria getCriteria() {
        return this.criteria;
    }

    public void setCriteria(Criteria criteria) {
        this.criteria = criteria;
    }

    public Poll getPoll() {
        return this.poll;
    }

    public void setPoll(Poll poll) {
        this.poll = poll;
    }

    public Choice getChoice() {
        return this.choice;
    }

    public void setChoice(Choice choice) {
        this.choice = choice;
    }

    public String getOutcome() {
        return this.outcome;
    }

    public void setOutcome(String outcome) {
        this.outcome = outcome;
    }

    @Override
    public String toString() {
        return "{" +
            " id='" + getId() + "'" +
            ", smartteam='" + getSmartteam() + "'" +
            ", user='" + getUser() + "'" +
            ", criteria='" + getCriteria() + "'" +
            ", poll='" + getPoll() + "'" +
            ", choice='" + getChoice() + "'" +
            ", outcome='" + getOutcome() + "'" +
            "}";
    }
    /* END OF GETTERS AND SETTERS */
}
