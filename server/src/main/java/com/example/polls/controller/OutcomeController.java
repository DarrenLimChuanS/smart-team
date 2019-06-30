package com.example.polls.controller;

import com.example.polls.exception.ResourceNotFoundException;
import com.example.polls.model.User;
import com.example.polls.model.Criteria;
import com.example.polls.model.Outcome;
import com.example.polls.model.Choice;
import com.example.polls.payload.*;
import com.example.polls.repository.PollRepository;
import com.example.polls.repository.UserRepository;
import com.example.polls.repository.CriteriaRepository;
import com.example.polls.repository.ChoiceRepository;
import com.example.polls.repository.VoteRepository;
import com.example.polls.security.UserPrincipal;
import com.example.polls.service.PollService;
import com.example.polls.service.CriteriaService;
import com.example.polls.service.OutcomeService;
import com.example.polls.security.CurrentUser;
import com.example.polls.util.AppConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import javax.validation.Valid;
import java.net.URI;

import java.util.List;

@RestController
@RequestMapping("/api/outcome")
public class OutcomeController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PollRepository pollRepository;

    @Autowired
    private CriteriaRepository criteriaRepository;

    @Autowired
    private CriteriaService criteriaService;

    @Autowired
    private OutcomeService outcomeService;

    @Autowired
    private ChoiceRepository choiceRepository;

    @Autowired
    private PollService pollService;

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Object> getOutcomeAndUpdate(@RequestBody OutcomeRequest outcomeRequest) {

        // Retrieve choice to get score
        Choice choice = choiceRepository.findById(outcomeRequest.getChoiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Choice", "id", outcomeRequest.getChoiceId()));

        // Call service to get category
        Outcome outcome = outcomeService.categorise(outcomeRequest, choice.getScore());

        //Update vote table
        return outcomeService.updateVote(outcomeRequest,choice,outcome.getOutcome());
    }


}
