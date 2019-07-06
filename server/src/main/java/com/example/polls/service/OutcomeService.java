package com.example.polls.service;

import com.example.polls.exception.ResourceNotFoundException;
import com.example.polls.model.Choice;
import com.example.polls.model.Criteria;
import com.example.polls.model.Outcome;
import com.example.polls.model.Vote;
import com.example.polls.payload.ApiResponse;
import com.example.polls.payload.OutcomeRequest;
import com.example.polls.repository.*;
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

        Criteria criteria = criteriaRepository.findByCriteriaId(outcomeRequest.getCriteriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Criteria", "id", outcomeRequest.getCriteriaId()));

        int q1 = criteria.getQ1();
        int q2 = criteria.getQ2();
        int q3 = criteria.getQ3();
        int q4 = criteria.getQ4();

        if(totalScore <= q1)
            outcome.setOutcome("q1");
        else if (totalScore > q1 && totalScore <= q2)
            outcome.setOutcome("q2");
        else if (totalScore > q2 && totalScore <= q3)
            outcome.setOutcome("q3");
        else if (totalScore <= q4)
            outcome.setOutcome("q4");

        outcome.setCriteriaId(outcomeRequest.getCriteriaId());

        return outcome;
    }

    /* TO UPDATE VOTE TABLE */
    public ResponseEntity<Object> updateVote(OutcomeRequest outcomeRequest, ArrayList<Choice> choiceObjectList, ArrayList<Long> pollIdList, String outcome) {
        for (int i = 0; i < choiceObjectList.size(); i++) {
            Vote tempVote = voteRepository.findByUserIdAndPollIdAndSmartteamIdAndCriteriaId(outcomeRequest.getUserId(),pollIdList.get(i),outcomeRequest.getSmartteamId(),outcomeRequest.getCriteriaId());
            tempVote.setChoice(choiceObjectList.get(i));
            tempVote.setOutcome(outcome);
            voteRepository.save(tempVote);
        }
        return ResponseEntity.ok(new ApiResponse(true, "Vote Updated Successfully"));
    }
    
}
