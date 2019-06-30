package com.example.polls.controller;

import com.example.polls.exception.ResourceNotFoundException;
import com.example.polls.model.User;
import com.example.polls.model.Criteria;
import com.example.polls.model.Outcome;
import com.example.polls.payload.*;
import com.example.polls.repository.PollRepository;
import com.example.polls.repository.UserRepository;
import com.example.polls.repository.CriteriaRepository;
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
    private PollService pollService;

    /* CALL TO GET OUTCOME OF CATEGORISING */
    // @GetMapping
    // @PreAuthorize("hasRole('USER')")
    // public Outcome getOutcome(@RequestBody OutcomeRequest outcomeRequest) {
    //     int totalScore = outcomeService.calculateTotalScore(outcomeRequest.getScore());

    //     return outcomeService.categorise(outcomeRequest, totalScore);
    // }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public Outcome getOutcome(@RequestBody OutcomeRequest outcomeRequest) {
        int totalScore = outcomeService.calculateTotalScore(outcomeRequest.getScore());

        return outcomeService.categorise(outcomeRequest, totalScore);
    }


}
