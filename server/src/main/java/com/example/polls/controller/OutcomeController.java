package com.example.polls.controller;

import com.example.polls.exception.ResourceNotFoundException;
import com.example.polls.model.Choice;
import com.example.polls.model.Outcome;
import com.example.polls.payload.OutcomeRequest;
import com.example.polls.repository.ChoiceRepository;
import com.example.polls.service.OutcomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/outcome")
public class OutcomeController {

    @Autowired
    private OutcomeService outcomeService;

    @Autowired
    private ChoiceRepository choiceRepository;

    @PutMapping("/update")
    @PreAuthorize("hasAnyRole('USER','STUDENT')")
    public ResponseEntity<Object> getOutcomeAndUpdate(@RequestBody OutcomeRequest outcomeRequest) {

        // Retrieve choice to get score
        Choice choice = choiceRepository.findById(outcomeRequest.getChoiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Choice", "id", outcomeRequest.getChoiceId()));

        // Call service to get category
        Outcome outcome = outcomeService.categorise(outcomeRequest, choice.getScore());
        System.out.println(outcome);
        // Update vote table
        return outcomeService.updateVote(outcomeRequest, choice, outcome.getOutcome());
    }

}
