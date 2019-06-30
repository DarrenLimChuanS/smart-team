package com.example.polls.payload;

import java.util.*;  
import java.util.ArrayList;


public class OutcomeRequest {

    private Long criteriaId;

    private Long smartteamId;

    private Long choiceId;

    private Long pollId;

    private Long userId;

    public Long getCriteriaId() {
        return this.criteriaId;
    }

    public void setCriteriaId(Long criteriaId) {
        this.criteriaId = criteriaId;
    }

    public Long getSmartteamId() {
        return this.smartteamId;
    }

    public void setSmartteamId(Long smartteamId) {
        this.smartteamId = smartteamId;
    }

    public Long getChoiceId() {
        return this.choiceId;
    }

    public void setChoiceId(Long choiceId) {
        this.choiceId = choiceId;
    }

    public Long getPollId() {
        return this.pollId;
    }

    public void setPollId(Long pollId) {
        this.pollId = pollId;
    }

    public Long getUserId() {
        return this.userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
