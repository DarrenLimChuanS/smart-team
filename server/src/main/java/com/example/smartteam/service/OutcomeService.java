package com.example.smartteam.service;

import com.example.smartteam.exception.ResourceNotFoundException;
import com.example.smartteam.model.Choice;
import com.example.smartteam.model.Criteria;
import com.example.smartteam.model.Outcome;
import com.example.smartteam.model.Vote;
import com.example.smartteam.payload.ApiResponse;
import com.example.smartteam.payload.OutcomeRequest;
import com.example.smartteam.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.util.*;  

@Service
public class OutcomeService {

    @Autowired
    private CriteriaRepository criteriaRepository;

    @Autowired
    private VoteRepository voteRepository;


    /* TO GET CATEGORISE RESULT */
    public Outcome categorise(OutcomeRequest outcomeRequest, int totalScore){
        Outcome outcome = new Outcome();

        Criteria criteria = criteriaRepository.findById(outcomeRequest.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Criteria", "id", outcomeRequest.getId()));

        int q1 = criteria.getQ1();
        int q2 = criteria.getQ2();
        int q3 = criteria.getQ3();
        int q4 = criteria.getQ4();

        if(totalScore <= q1)
            outcome.setOutcome("q1");
        else if (totalScore <= q2)
            outcome.setOutcome("q2");
        else if (totalScore <= q3)
            outcome.setOutcome("q3");
        else if (totalScore <= q4)
            outcome.setOutcome("q4");

        outcome.setCriteriaId(outcomeRequest.getId());

        return outcome;
    }

    /* TO UPDATE VOTE TABLE */
    public ResponseEntity<Object> updateVote(OutcomeRequest outcomeRequest, ArrayList<Choice> choiceObjectList, ArrayList<Long> pollIdList, String outcome) {
        for (int i = 0; i < choiceObjectList.size(); i++) {
            Vote tempVote = voteRepository.findByUserIdAndPollIdAndSmartteamIdAndCriteriaId(outcomeRequest.getUserId(),pollIdList.get(i),outcomeRequest.getSmartteamId(),outcomeRequest.getId());
            tempVote.setChoice(choiceObjectList.get(i));
            tempVote.setOutcome(outcome);
            voteRepository.save(tempVote);
        }
        return ResponseEntity.ok(new ApiResponse(true, "Vote Updated Successfully"));
    }
    
}
