package com.example.smartteam.controller;

import com.example.smartteam.exception.ResourceNotFoundException;
import com.example.smartteam.model.Choice;
import com.example.smartteam.model.*;
import com.example.smartteam.model.Outcome;
import com.example.smartteam.payload.OutcomeRequest;
import com.example.smartteam.repository.ChoiceRepository;
import com.example.smartteam.service.OutcomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.smartteam.repository.*;
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
    private CriteriaRepository criteriaRepository;

    @PutMapping("/update")
    @PreAuthorize("hasAnyRole('USER','STUDENT')")
    public ResponseEntity<Object> getOutcomeAndUpdate(@RequestBody OutcomeRequest outcomeRequest) {
        int totalScore = 0;
        ArrayList<Long> choiceIdList = new ArrayList<Long>();
        ArrayList<Long> pollIdList = new ArrayList<Long>();
        ArrayList<Choice> choiceObjectList = new ArrayList<Choice>();

        // Get all pollIds using criteriaId
        Criteria criteria = criteriaRepository.findById(outcomeRequest.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Criteria", "id", outcomeRequest.getId()));

        // Get a list of choiceId and Check choices that already made in vote table
        for (Poll tempPollObject : criteria.getPolls()) {
            Vote tempVote = voteRepository.findByUserIdAndPollIdAndSmartteamIdAndCriteriaId(outcomeRequest.getUserId(),
                    tempPollObject.getId(), outcomeRequest.getSmartteamId(), outcomeRequest.getId());
            // Get answered poll's pollIds and choiceIds
            if (tempVote.getChoice() != null && !tempVote.getPoll().getId().equals(outcomeRequest.getPollId())) {
                choiceIdList.add(tempVote.getChoice().getId());
                pollIdList.add(tempPollObject.getId());
            }
        }

        // Add current request into list
        choiceIdList.add(outcomeRequest.getChoiceId());
        pollIdList.add(outcomeRequest.getPollId());

        // Retrieve Choice object to gather a list for update later and to get and count
        // scores
        for (Long choiceId : choiceIdList) {
            Choice choice = choiceRepository.findById(choiceId)
                    .orElseThrow(() -> new ResourceNotFoundException("Choice", "id", choiceId));
            choiceObjectList.add(choice);
            totalScore += choice.getScore();
        }

        // Call service to get category
        Outcome outcome = outcomeService.categorise(outcomeRequest, totalScore);

        // Update vote table
        return outcomeService.updateVote(outcomeRequest, choiceObjectList, pollIdList, outcome.getOutcome());
    }

    @GetMapping("/smartteam/{smartteamId}")
    @PreAuthorize("hasAnyRole('USER','STUDENT')")
    public List<Vote> getVotesBySmartteamId(@PathVariable long smartteamId) {
        return voteRepository.findAllBySmartteamId(smartteamId);
    }
}
