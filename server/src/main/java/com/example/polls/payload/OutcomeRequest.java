package com.example.polls.payload;

public class OutcomeRequest {

    private Long id;

    private Long smartteamId;

    private Long choiceId;

    private Long pollId;

    private Long userId;

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
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
