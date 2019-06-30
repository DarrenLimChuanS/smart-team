package com.example.polls.payload;

import java.util.*;  
import java.util.ArrayList;


public class OutcomeRequest {

    private String name;

    private Long criteriaId;

    private ArrayList<Integer> score =new ArrayList<Integer>();

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getCriteriaId() {
        return criteriaId;
    }

    public void setCriteriaId(Long criteriaId) {
        this.criteriaId = criteriaId;
    }

    public ArrayList getScore() {
        return score;
    }

    public void setScore(ArrayList<Integer> scores) {
        this.score.clear();
        for(int i = 0; i < scores.size(); i++)
            this.score.add(scores.get(i));
    }

}
