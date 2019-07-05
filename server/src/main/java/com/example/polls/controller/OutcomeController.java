package com.example.polls.controller;

import com.example.polls.exception.ResourceNotFoundException;
import com.example.polls.model.Choice;
import com.example.polls.model.*;
import com.example.polls.model.Outcome;
import com.example.polls.payload.OutcomeRequest;
import com.example.polls.repository.ChoiceRepository;
import com.example.polls.service.OutcomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.polls.repository.*;
import java.util.*;  

@RestController
@RequestMapping("/api/outcome")
public class OutcomeController {

    @Autowired
    private OutcomeService outcomeService;

    @Autowired
    private ChoiceRepository choiceRepository;

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private PollRepository pollRepository;

    @Autowired
    private CriteriaRepository criteriaRepository;

    @PutMapping("/update")
    // @PreAuthorize("hasAnyRole('USER','STUDENT')")
    public ResponseEntity<Object> getOutcomeAndUpdate(@RequestBody OutcomeRequest outcomeRequest) {
        int totalScore = 0;
        ArrayList<Long> choiceIdList = new ArrayList<Long>();
        ArrayList<Long> pollIdList = new ArrayList<Long>();
        ArrayList<Poll> pollObjectList = new ArrayList<Poll>();
        ArrayList<Poll> finalPollObjectList = new ArrayList<Poll>();
        ArrayList<Choice> choiceObjectList = new ArrayList<Choice>();

        // Retrieve choice to get score (NOT IN USE! FOR REFERENCE)
        // Choice choice = choiceRepository.findById(outcomeRequest.getChoiceId())
        //         .orElseThrow(() -> new ResourceNotFoundException("Choice", "id", outcomeRequest.getChoiceId()));

        // Get all pollIds in criteria
        Criteria criteria = criteriaRepository.findByCriteriaId(outcomeRequest.getCriteriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Criteria", "id", outcomeRequest.getCriteriaId()));

        // Get a list of choiceId and Check choices that already made in vote table
        for (Poll tempPollObject : criteria.getPolls()){
            Vote tempVote = voteRepository.findByUserIdAndPollIdAndSmartteamIdAndCriteriaId(outcomeRequest.getUserId(),tempPollObject.getId(),outcomeRequest.getSmartteamId(),outcomeRequest.getCriteriaId());
            if (tempVote.getChoice() != null){
                choiceIdList.add(tempVote.getChoice().getId());
                pollIdList.add(tempPollObject.getId());
                finalPollObjectList.add(tempVote.getPoll());
            }
        }

        // Add current request into list
        choiceIdList.add(outcomeRequest.getChoiceId());
        pollIdList.add(outcomeRequest.getPollId());

        // Retrieve Choice object to gather a list for update later and to get and count scores
        for (Long choiceId : choiceIdList){
            Choice choice = choiceRepository.findById(choiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Choice", "id", choiceId));
            choiceObjectList.add(choice);
            totalScore += choice.getScore(); 
        }

        // Calculate Totalscore ( NOT IN USE)
        // int totalScore = outcomeService.calculateScore(outcomeRequest, choiceList);

        // Call service to get category
        Outcome outcome = outcomeService.categorise(outcomeRequest, totalScore);
        System.out.println(outcome);

        // Update vote table
        return outcomeService.updateVote(outcomeRequest, choiceObjectList, pollIdList, outcome.getOutcome());
    }

}
